import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { TbCheck, TbLink, TbMail, TbX } from "react-icons/tb";

// Demo link to be copied
const GROUP_ORDER_LINK = "https://your-app.com/group-order/12345";

export interface GroupOrderData {
  id: string;
  name: string;
  createdAt: string;
  sharingMethod: "link" | "email";
  link: string;
  emails: string[];
  hasBudgetLimit: boolean;
  budgetLimit: number | null;
  members: Array<{
    name: string;
    items: any[];
  }>;
}

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroupOrder: (groupOrderData: GroupOrderData) => void;
}

const GroupOrderModal = ({
  isOpen,
  onClose,
  onCreateGroupOrder,
}: GroupOrderModalProps) => {
  const [orderName, setOrderName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [hasBudgetLimit, setHasBudgetLimit] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState(20);
  const [tabIndex, setTabIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const linkRef = useRef(null);
  const toast = useToast();

  // Handle copying the link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(GROUP_ORDER_LINK);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "Group order link has been copied to clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset the copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle adding an email to the list
  const addEmail = () => {
    if (currentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    } else if (currentEmail) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle removing an email from the list
  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  // Handle the Enter key for adding emails
  const handleKeyPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addEmail();
    }
  };

  // Handle inviting via email
  const handleInvite = () => {
    if (emails.length <= 1 && !emails[0]) {
      toast({
        title: "No recipients",
        description: "Please add at least one email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In a real implementation, you would send the invites here
    toast({
      title: "Invitations sent!",
      description: `Group order invitation sent to ${emails.filter((e) => e).length} people.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle creating the group order
  const handleCreateOrder = () => {
    if (!orderName) {
      toast({
        title: "Name required",
        description: "Please name your group order.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create group order object
    const groupOrderData: GroupOrderData = {
      id: `go-${Date.now()}`,
      name: orderName,
      createdAt: new Date().toISOString(),
      sharingMethod: tabIndex === 0 ? "link" : "email",
      link: GROUP_ORDER_LINK,
      emails: tabIndex === 1 ? emails.filter((email) => email) : [],
      hasBudgetLimit,
      budgetLimit: hasBudgetLimit ? budgetLimit : null,
      members: [{ name: "You (Organizer)", items: [] }],
    };

    if (tabIndex === 0) {
      handleCopyLink();
    } else {
      handleInvite();
    }

    // Pass the group order data back to parent
    onCreateGroupOrder(groupOrderData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Group Order</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Group Order Name */}
            <FormControl isRequired>
              <FormLabel>Group Order Name</FormLabel>
              <Input
                placeholder="e.g., Team Lunch, Family Dinner"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
              />
            </FormControl>

            <Divider />

            {/* Sharing Options */}
            <Text fontWeight="medium">Share with others</Text>

            <Tabs
              variant="soft-rounded"
              colorScheme="secondary"
              index={tabIndex}
              onChange={setTabIndex}
            >
              <TabList gap="2">
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={TbLink} fontSize=".75rem" />
                    <Text>Share Link</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={TbMail} fontSize=".75rem" />
                    <Text>Email Invites</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Share Link Panel */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={3}>
                    <Text fontSize="sm" color="gray.600">
                      Anyone with this link can join your group order. Copy and
                      share it with your group.
                    </Text>

                    <InputGroup>
                      <Input
                        ref={linkRef}
                        value={GROUP_ORDER_LINK}
                        isReadOnly
                        pr="4.5rem"
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                          icon={
                            <Icon
                              as={isCopied ? TbCheck : TbLink}
                              fontSize=".75rem"
                            />
                          }
                          h="1.75rem"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyLink}
                          aria-label={"Copy link"}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </VStack>
                </TabPanel>

                {/* Email Invites Panel */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={3}>
                    <Text fontSize="sm" color="gray.600">
                      Send email invitations to your group members.
                    </Text>

                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        placeholder="Enter email address"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <InputRightElement width="4rem">
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="gray"
                          onClick={addEmail}
                        >
                          Add
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    {emails.some((email) => email) && (
                      <Box maxH="150px" overflowY="auto" py={2}>
                        <VStack align="stretch" spacing={2}>
                          {emails.map(
                            (email, index) =>
                              email && (
                                <Flex
                                  key={index}
                                  justify="space-between"
                                  align="center"
                                  bg="gray.100"
                                  p={2}
                                  borderRadius="md"
                                >
                                  <Text fontSize="sm">{email}</Text>
                                  <IconButton
                                    variant="ghost"
                                    icon={<Icon as={TbX} fontSize=".75rem" />}
                                    size="xs"
                                    aria-label="Remove email"
                                    onClick={() => removeEmail(index)}
                                  />
                                </Flex>
                              )
                          )}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Divider />

            {/* Budget Limit Option */}
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="budget-limit" mb="0">
                Set maximum spending limit
              </FormLabel>
              <Switch
                id="budget-limit"
                isChecked={hasBudgetLimit}
                onChange={(e) => setHasBudgetLimit(e.target.checked)}
              />
            </FormControl>

            {hasBudgetLimit && (
              <FormControl>
                <FormLabel>Maximum amount per person ($)</FormLabel>
                <NumberInput
                  value={budgetLimit}
                  onChange={(valueString) =>
                    setBudgetLimit(parseInt(valueString))
                  }
                  min={1}
                  max={500}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" size="sm" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="primary" size="sm" onClick={handleCreateOrder}>
            Create Group Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupOrderModal;
