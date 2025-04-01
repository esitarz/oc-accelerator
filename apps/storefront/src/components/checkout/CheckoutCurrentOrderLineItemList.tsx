import { LineItem } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import OcLineItemList from './cart/CartLineItemList'

interface CheckoutCurrentOrderLineItemListProps {
  emptyMessage?: string;
  editable?: boolean;
  productType?: string;
  lineItems?: LineItem[];
  onChange: (newLineItem: LineItem) => void;
}

const CheckoutCurrentOrderLineItemList: FunctionComponent<CheckoutCurrentOrderLineItemListProps> = ({
  emptyMessage,
  editable,
  productType,
  lineItems,
  onChange
}) => {
  let productItems = lineItems
  if (productType != null) {
    productItems = lineItems?.filter(function (p) {
      return p.xp?.Type == productType
    })
  }

  return (
    <OcLineItemList
      emptyMessage={emptyMessage}
      editable={editable}
      lineItems={productItems}
      onChange={onChange}
    />
  )
}

export default CheckoutCurrentOrderLineItemList
