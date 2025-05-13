import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  Input,
  InputGroup,
  Stack,
  Text,
  VStack,
  useToast,
  HStack,
  Avatar,
  AvatarGroup,
  Icon,
  IconButton,
  Badge,
  Box,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { useShopper } from "@ordercloud/react-sdk";
import {
  LineItem,
  Order,
  OrderPromotion,
  RequiredDeep,
} from "ordercloud-javascript-sdk";
import React, { FormEvent, useCallback, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import OcCurrentOrderLineItemList from "./OcCurrentOrderLineItemList";
import { TABS } from "./ShoppingCart";
import { TbClipboard, TbClock, TbCoin, TbLink, TbMail, TbTrash, TbUsers, TbUsersGroup } from "react-icons/tb";
import { useGroupOrder } from "../../context/GroupOrderContext";

interface CartSummaryProps {
  order: RequiredDeep<Order>;
  lineItems: LineItem[];
  promotions?: OrderPromotion[];
  deleteOrder: () => void;
  tabIndex: number;
  // Keep onSubmitOrder in the interface for future compatibility
  onSubmitOrder?: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  order,
  lineItems,
  promotions,
  deleteOrder,
  tabIndex,
}) => {
  const { addCartPromo, removeCartPromo } = useShopper();
  const [promoCode, setPromoCode] = useState<string>("");
  
  // Use the shared group order state
  const { groupOrder, setGroupOrder, assignUsersToLineItems } = useGroupOrder();
  const toast = useToast();
  
  // Assign mock users to line items for the demo using the shared function
  const lineItemsWithUsers = assignUsersToLineItems(lineItems);
  
  const handleLineItemChange = (newLi: LineItem) => {
    // Implement the logic to update the line item
    console.log("Line item updated:", newLi);
  };

  const handleApplyPromotion = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!promoCode) return;
      try {
        addCartPromo(promoCode);
        toast({
          title: `Promotion '${promoCode}' applied to cart`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setPromoCode("");
      } catch (error) {
        console.error(error);
      }
    },
    [addCartPromo, promoCode, toast]
  );

  const handleRemovePromotion = useCallback(
    async (promoCode: string | undefined) => {
      if (!promoCode) return;
      try {
        await removeCartPromo(promoCode);
        toast({
          title: `Promotion '${promoCode}' removed from cart`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setPromoCode("");
      } catch (error) {
        console.error(error);
      }
    },
    [removeCartPromo, toast]
  );

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
    <VStack align="stretch" spacing={6}>
      <ButtonGroup alignItems="center" gap={3} alignSelf="flex-end">
        <Button variant="link" size="xs" onClick={deleteOrder}>
          Clear cart
        </Button>
        <Button
          size="xs"
          variant="outline"
          as={RouterLink}
          to="/products"
        >
          Continue shopping
        </Button>
      </ButtonGroup>
      
      {/* Group Order Details - only show if exists */}
      {groupOrder && (
        <Card variant="outline" shadow="sm" mb={2}>
          <CardHeader bg="gray.50" pb={2}>
            <Flex justifyContent="space-between" alignItems="center">
              <HStack>
                <Icon as={TbUsersGroup} color="primary.500" boxSize="5" />
                <Text fontWeight="bold">{groupOrder.name}</Text>
                <Badge colorScheme="green" variant="subtle">Active</Badge>
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
                  as={groupOrder.sharingMethod === "link" ? TbLink : TbMail}
                />
                <Text>
                  {groupOrder.sharingMethod === "link"
                    ? "Shared via link"
                    : `Invited ${groupOrder.emails.length} ${
                        groupOrder.emails.length === 1 ? "person" : "people"
                      } via email`}
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
                  <Text fontSize="sm">Members ({groupOrder.members.length})</Text>
                </HStack>
                <AvatarGroup size="xs" max={3}>
                  {groupOrder.members.map((member, idx) => (
                    <Avatar 
                      key={idx} 
                      name={member.name} 
                      src=""
                      title={member.name}
                    />
                  ))}
                </AvatarGroup>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      )}
      
      <OcCurrentOrderLineItemList
        lineItems={lineItemsWithUsers}
        emptyMessage="Your cart is empty"
        onChange={handleLineItemChange}
        editable={false}
      />
      <Divider />
      <form id="APPLY_PROMO" onSubmit={handleApplyPromotion}>
        <Flex justify="space-between">
          <FormControl isRequired mb={3}>
            <InputGroup>
              <Input
                aria-label="Gift card or discount code"
                placeholder="Gift card or discount code"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </InputGroup>
          </FormControl>
          <Button colorScheme="secondary" ml={2} type="submit">
            Apply
          </Button>
        </Flex>
      </form>
      {promotions?.map((p) => (
        <Flex justify="space-between" key={p.Code}>
          <Text alignContent="center">{p.Code?.toLocaleUpperCase()}</Text>
          <Button
            colorScheme="danger"
            onClick={() => handleRemovePromotion(p.Code)}
          >
            Remove
          </Button>
        </Flex>
      ))}
      <Divider />
      <Stack spacing={3}>
        <Flex justify="space-between">
          <Text>Subtotal</Text>
          <Text>${order.Subtotal?.toFixed(2)}</Text>
        </Flex>
        {order.PromotionDiscount && order.PromotionDiscount > 0 && (
          <Flex justify="space-between">
            <Text>Promotion Discount</Text>
            <Text>- ${order.PromotionDiscount?.toFixed(2)}</Text>
          </Flex>
        )}
        <Flex justify="space-between">
          <Text>Shipping</Text>
          {tabIndex !== TABS.SHIPPING ||
            (tabIndex !== TABS.INFORMATION && <Text></Text>)}
          <Text>
            {order.ShippingCost === 0
              ? "FREE SHIPPING"
              : "$" + order.ShippingCost}
          </Text>
        </Flex>
        {/* <Flex justify="space-between">
          <Text>Tax</Text>
          {tabIndex !== TABS.SHIPPING ||
            (tabIndex !== TABS.INFORMATION && <Text></Text>)}
          <Text>{taxCost}</Text>
        </Flex> */}
        <Flex justify="space-between" fontWeight="bold" fontSize="lg">
          <Text>Total</Text>
          <Text>${order.Total?.toFixed(2)}</Text>
        </Flex>
      </Stack>
    </VStack>
  );
};

export default CartSummary;
