import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  IconButton,
  Text,
  SimpleGrid,
  Spinner,
  Stack,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BuyerProduct } from "ordercloud-javascript-sdk";
import { parse } from "querystring";
import React, { FunctionComponent, useCallback, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Pagination from "../shared/pagination/Pagination";
import FilterSearchMenu, {
  ServiceListOptions,
} from "../shared/search/SearchMenu";
import FacetList from "./facets/FacetList";
import ProductCard from "./ProductCard";
import { useOcResourceListWithFacets } from "@ordercloud/react-sdk";
import { GrFacebook } from "react-icons/gr";
import { TbClipboard, TbClock, TbCoin, TbLink, TbMail, TbPhoto, TbTrash, TbUsers, TbUsersGroup } from "react-icons/tb";
import GroupOrderModal, { GroupOrderData } from "./GroupOrderModal";

export interface ProductListProps {
  renderItem?: (product: BuyerProduct) => JSX.Element;
}

const ProductList: FunctionComponent<ProductListProps> = ({ renderItem }) => {
  const { catalogId, categoryId } = useParams<{
    catalogId: string;
    categoryId: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isGroupOrderOpen, onOpen: onGroupOrderOpen, onClose: onGroupOrderClose } = useDisclosure();

  const [groupOrder, setGroupOrder] = useState<GroupOrderData | null>(null);
  const toast = useToast();

  const searchTerm = useMemo(() => {
    return searchParams.get("search") || undefined;
  }, [searchParams]);

  const currentPage = useMemo(() => {
    return Number(searchParams.get("page")) || 1;
  }, [searchParams]);

  const filters = useMemo(() => {
    const filtersObj = {} as { [key: string]: string | string[] };
    for (const key of searchParams.keys()) {
      if (!["search", "page", "pageSize"].includes(key)) {
        filtersObj[key] = searchParams.getAll(key);
      }
      searchParams.getAll(key);
    }
    return filtersObj;
  }, [searchParams]);

  const { data, isLoading } = useOcResourceListWithFacets<BuyerProduct>(
    "Me.Products",
    {
      search: searchTerm,
      page: currentPage.toString(),
      catalogId,
      categoryId,
      ...filters,
    }
  );

  const handleRoutingChange = useCallback(
    (queryKey: string, resetPage?: boolean, index?: number) =>
      (value?: string | boolean | number) => {
        const searchParams = new URLSearchParams(location.search);
        const hasPageParam = Boolean(searchParams.get("page"));
        const isFilterParam = !["search", "page", "pageSize"].includes(
          queryKey
        );

        // filters can have multiple values for one key i.e. SpecCount > 0 AND SpecCount < 2
        const prevValue = isFilterParam
          ? searchParams.getAll(queryKey)
          : searchParams.get(queryKey);
        if (!value && !prevValue) return;
        if (value) {
          if (!isFilterParam && prevValue !== value) {
            searchParams.set(queryKey, value.toString());
          } else if (isFilterParam) {
            prevValue?.includes(value.toString())
              ? searchParams.delete(queryKey, value.toString())
              : searchParams.append(queryKey, value.toString());
          }
          if (hasPageParam && resetPage) searchParams.delete("page"); // reset page on filter change
        } else if (prevValue) {
          searchParams.delete(
            queryKey,
            index !== undefined ? prevValue[index] : undefined
          );
        }

        navigate(
          { pathname: location.pathname, search: searchParams.toString() },
          { state: { shallow: true } }
        );
      },
    [location.pathname, location.search, navigate]
  );

  const listOptions = useMemo(() => {
    return parse(location.search.slice(1)) as ServiceListOptions;
  }, [location.search]);

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleCreateGroupOrder = (groupOrderData: GroupOrderData) => {
    setGroupOrder(groupOrderData);
    onGroupOrderClose();
  };

  const handleCopyLink = () => {
    if (groupOrder) {
      navigator.clipboard.writeText(groupOrder.link);
      toast({
        title: "Link copied!",
        description: "Group order link has been copied to clipboard.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGroupOrder = () => {
    setGroupOrder(null);
    toast({
      title: "Group order deleted",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <FilterSearchMenu
              listOptions={listOptions}
              handleRoutingChange={handleRoutingChange}
            />
            <FacetList
              facets={data?.Meta?.Facets}
              onChange={handleRoutingChange}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Grid
        gridTemplateColumns={{ md: "300px 1fr" }}
        gap="4"
        alignItems="flex-start"
      >
        <Card
          as={GridItem}
          position="sticky"
          top="20"
          display={{ base: "none", md: "block" }}
        >
          <GroupOrderModal
            isOpen={isGroupOrderOpen}
            onClose={onGroupOrderClose}
            onCreateGroupOrder={handleCreateGroupOrder}
          />
          <CardBody as={VStack} alignItems="stretch">
            {/* <Button leftIcon={<Icon color="primary.200" as={TbUsersGroup} />} onClick={onGroupOrderOpen}>
              Start group order
            </Button>
            <GroupOrderModal isOpen={isGroupOrderOpen} onClose={onGroupOrderClose} /> */}
            <Box mb={6}>
              {!groupOrder ? (
                <Button
                  leftIcon={<Icon as={TbUsersGroup} />}
                  onClick={onGroupOrderOpen}
                  colorScheme="primary"
                  size="sm"
                >
                  Start group order
                </Button>
              ) : (
                <Card variant="outline" shadow="sm" mb={6}>
                  <CardHeader bg="gray.50" pb={2}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <HStack>
                        <Icon
                          as={TbUsersGroup}
                          color="primary.500"
                          boxSize="5"
                        />
                        <Heading size="sm">{groupOrder.name}</Heading>
                        <Badge colorScheme="green" variant="subtle">
                          Active
                        </Badge>
                      </HStack>
                      <HStack>
                        <IconButton
                          aria-label="Copy link"
                          icon={<Icon as={TbClipboard} fontSize="sm" />}
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyLink}
                        />
                        <IconButton
                          aria-label="Delete group order"
                          icon={<Icon as={TbTrash} fontSize="sm" />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={handleDeleteGroupOrder}
                        />
                      </HStack>
                    </Flex>
                  </CardHeader>
                  <CardBody pt={3}>
                    <Stack spacing={3}>
                      <HStack fontSize="sm" color="gray.600">
                        <Icon as={TbClock} fontSize=".75rem" />
                        <Text>Created {formatDate(groupOrder.createdAt)}</Text>
                      </HStack>

                      <HStack fontSize="sm" color="gray.600">
                        <Icon
                          fontSize=".75rem"
                          as={
                            groupOrder.sharingMethod === "link"
                              ? TbLink
                              : TbMail
                          }
                        />
                        <Text>
                          {groupOrder.sharingMethod === "link"
                            ? "Shared via link"
                            : `Invited ${groupOrder.emails.length} ${groupOrder.emails.length === 1 ? "person" : "people"} via email`}
                        </Text>
                      </HStack>

                      {groupOrder.hasBudgetLimit && (
                        <HStack fontSize="sm" color="gray.600">
                          <Icon as={TbCoin} fontSize=".75rem" />
                          <Text>Max ${groupOrder.budgetLimit} per person</Text>
                        </HStack>
                      )}

                      <Divider />

                      <Flex justifyContent="space-between" alignItems="center">
                        <HStack>
                          <Icon as={TbUsers} fontSize=".75rem" />
                          <Text fontSize="sm">
                            Members ({groupOrder.members.length})
                          </Text>
                        </HStack>
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              )}
            </Box>

            <FilterSearchMenu
              listOptions={listOptions}
              handleRoutingChange={handleRoutingChange}
            />
            <FacetList
              facets={data?.Meta?.Facets}
              onChange={handleRoutingChange}
            />
          </CardBody>
        </Card>
        <GridItem display={{ base: "block", md: "none" }}>
          <Button aria-label="Open Filters" onClick={onOpen} mb={4} size="sm">
            Refine your search
          </Button>
        </GridItem>
        <SimpleGrid
          as={GridItem}
          w="full"
          gridTemplateColumns="repeat(auto-fill, minmax(270px, 1fr))"
          spacing={4}
        >
          {data?.Items?.map((p) => (
            <React.Fragment key={p.ID}>
              {renderItem ? renderItem(p) : <ProductCard product={p} />}
            </React.Fragment>
          ))}
        </SimpleGrid>
        {data?.Items?.length === 0 && (
          <Center h="20vh">
            <Heading as="h2" size="md">
              No products found
            </Heading>
          </Center>
        )}
      </Grid>

      {data?.Meta?.TotalPages && data?.Meta?.TotalPages > 1 && (
        <Center>
          <Pagination
            page={currentPage}
            totalPages={data?.Meta?.TotalPages}
            onChange={handleRoutingChange("page")}
          />
        </Center>
      )}
    </>
  );
};

export default ProductList;
