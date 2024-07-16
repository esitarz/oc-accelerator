import { Box, Button, Flex, HStack, useDisclosure, useToast } from '@chakra-ui/react'
import { useColumns, useDeleteOcResource, useHasAccess } from '@rwatt451/ordercloud-react'
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  TableState,
  VisibilityState,
} from '@tanstack/react-table'
import { title } from 'case'
import pluralize from 'pluralize'
import { parse } from 'querystring'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { flattenNestedProperties } from '../../utils/spec.utils'
import { CreateModal } from './modals/CreateModal'
import ListView, { ServiceListOptions } from './ListView'
import ResourceTableCell from './ResourceTableCell'
import SCHEMA_SORT_ORDER from '../../config/schemaSortOrder.config'
import { OpenAPIV3 } from 'openapi-types'
import ActionMenu from './ActionMenu'
import DeleteModal from './modals/DeleteModal'
import { ApiError } from '../OperationForm'
import FilterSearchMenu from './FilterSearchMenu'
import NoAccessMessage from '../Shared/NoAccessMessage'
import { tableOverrides } from '../../config/tableOverrides'
import { cloneDeep } from 'lodash'

interface ResourceListProps {
  resourceName: string
  hrefResolver?: (item: unknown) => string
  hideToolbar?: boolean
  filters?: {
    [filterKey: string]: string
  }
  readOnly?: boolean
}

export const cellCallback = (cellValue: unknown, properties: OpenAPIV3.SchemaObject) => {
  return (
    <ResourceTableCell
      value={cellValue}
      properties={properties}
    />
  )
}

const ResourceList: FC<ResourceListProps> = ({ resourceName, readOnly, hrefResolver }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const routeParams = useParams() as { [key: string]: string }
  const createDrawerDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()
  const [actionItem, setActionItem] = useState<any>()
  const { isAdmin, allowed } = useHasAccess(resourceName)
  const toast = useToast()

  const { properties, columnHeaders, requiredParameters, dynamicColumns } = useColumns(
    resourceName,
    SCHEMA_SORT_ORDER,
    cellCallback
  )

  const requiredParams = useMemo(() => {
    const paramsObj = {} as { [key: string]: string }
    requiredParameters.forEach((p: string) => {
      paramsObj[p] = (routeParams[p] as string) || actionItem?.ID
    })
    return paramsObj
  }, [actionItem?.ID, requiredParameters, routeParams])

  const { mutateAsync: deleteAsync, error: deleteError } = useDeleteOcResource(resourceName, {
    ...routeParams,
    ...requiredParams,
  })

  useEffect(() => {
    const ocError = deleteError?.response?.data?.Errors[0] as ApiError
    if (ocError && !toast.isActive(ocError.ErrorCode)) {
      toast({
        id: ocError.ErrorCode,
        title: ocError.Message,
        status: 'error',
      })
    }
  }, [deleteError, toast])

  const getVisibility = useCallback(() => {
    // show/hide columns if table override exists for this resource
    if (tableOverrides[resourceName]) {
      const overrideKeys = Object.keys(tableOverrides[resourceName])
      const headerVisibility = {} as any

      // eslint-disable-next-line no-inner-declarations
      function EvaluateVisibility(obj: any) {
        for (const prop in obj) {
          const value = obj[prop]
          if (!value?.columns) {
            headerVisibility[value.id] = !!overrideKeys.includes(value.id)
          } else {
            EvaluateVisibility(value.columns)
          }
        }
      }

      EvaluateVisibility(dynamicColumns)
      return headerVisibility
    }
  }, [resourceName, dynamicColumns])

  const sortedOverrideColumns = useMemo(() => {
    if (tableOverrides[resourceName]) {
      const overrides = Object.keys(tableOverrides[resourceName])
      return cloneDeep(dynamicColumns).sort(function (a: any, b: any) {
        return overrides.indexOf(a.header) - overrides.indexOf(b.header)
      })
    }
  }, [dynamicColumns, resourceName])

  const [columnVisibility, _setColumnVisibility] = useState<VisibilityState>(getVisibility)

  /* @tanstack/react-table table state */

  const columnFilters = useMemo(() => {
    const filters = [] as { id: string; value: string }[]
    for (const entry of searchParams.entries()) {
      if (Object.keys(flattenNestedProperties(properties))?.includes(entry[0])) {
        filters.push({ id: entry[0], value: entry[1] })
      }
    }
    return filters as ColumnFiltersState
  }, [searchParams, properties])

  const pagination = useMemo(() => {
    const pageValue = searchParams.get('page')
    const pageSize = searchParams.get('pageSize')
    return {
      pageIndex: pageValue ? Number(pageValue) - 1 : 0,
      pageSize: pageSize ?? 20,
    } as PaginationState
  }, [searchParams])

  const sorting = useMemo(() => {
    const sort = searchParams.get('sortBy')
    return [
      {
        id: sort?.replace('!', ''),
        desc: sort?.includes('!'),
      },
    ] as SortingState
  }, [searchParams])

  const tableState = useMemo(() => {
    return {
      pagination,
      columnFilters,
      columnVisibility,
      sorting,
    } as Partial<TableState>
  }, [columnFilters, columnVisibility, pagination, sorting])

  const handleRoutingChange = useCallback(
    (queryKey: string, resetPage?: boolean) => (value?: string | boolean | number) => {
      const searchParams = new URLSearchParams(location.search)
      const hasPageParam = Boolean(searchParams.get('page'))

      const prevValue = searchParams.get(queryKey)
      if (value) {
        if (prevValue !== value) {
          searchParams.set(queryKey, value.toString())
          if (hasPageParam && resetPage) searchParams.delete('page') // reset page on filter change
        }
      } else if (prevValue) {
        searchParams.delete(queryKey)
      }

      navigate(
        { pathname: location.pathname, search: searchParams.toString() },
        { state: { shallow: true } }
      )
    },
    [location.pathname, location.search, navigate]
  )

  const listOptions = useMemo(() => {
    return parse(location.search.slice(1)) as ServiceListOptions
  }, [location.search])

  const resolveHref = useCallback(
    (rowData: any) => {
      if (hrefResolver) hrefResolver(rowData)
      return `${location.pathname}/${rowData?.ID}`
    },
    [location.pathname, hrefResolver]
  )

  const renderResourceActionsMenu = useCallback(
    (item: any) => {
      return (
        <ActionMenu
          item={item}
          url={resolveHref(item)}
          onOpen={() => {
            setActionItem(item)
          }}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen, resolveHref]
  )

  return dynamicColumns ? (
    <>
      {!allowed && <NoAccessMessage resourceName={resourceName} />}
      <ListView
        columnDef={tableOverrides[resourceName] ? sortedOverrideColumns : dynamicColumns}
        itemHrefResolver={resolveHref}
        parameters={routeParams}
        listOptions={listOptions}
        tableState={tableState}
        onOptionChange={handleRoutingChange}
        itemActions={readOnly || !isAdmin ? undefined : renderResourceActionsMenu}
        resourceName={resourceName}
        hasAccess={allowed}
      >
        {({ renderContent }) => (
          <>
            <Flex
              direction="column"
              wrap="nowrap"
              h="calc(100vh - 100px)"
              overflow="hidden"
            >
              <Box
                flex="0 0 auto"
                p={3}
                px={4}
                borderBottom="1px solid"
                borderBottomColor="chakra-border-color"
              >
                <HStack>
                  {allowed && (
                    <FilterSearchMenu
                      resourceName={resourceName}
                      columnHeaders={columnHeaders}
                      columnFilters={columnFilters}
                      listOptions={listOptions}
                      properties={properties}
                      handleRoutingChange={handleRoutingChange}
                    />
                  )}
                  {!readOnly && isAdmin && (
                    <Button
                      ml="auto"
                      variant="solid"
                      colorScheme="primary"
                      onClick={createDrawerDisclosure.onOpen}
                    >
                      {`Create ${pluralize.singular(title(resourceName))}`}
                    </Button>
                  )}

                  <CreateModal
                    resourceId={resourceName}
                    disclosure={createDrawerDisclosure}
                  />
                  <DeleteModal
                    onComplete={deleteAsync}
                    resource={resourceName}
                    item={actionItem}
                    disclosure={deleteDisclosure}
                  />
                </HStack>
              </Box>

              <Box flex="1 0 auto">{renderContent}</Box>
            </Flex>
          </>
        )}
      </ListView>
    </>
  ) : null
}

export default ResourceList