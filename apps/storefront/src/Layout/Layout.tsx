import {
  Container,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useOrderCloudContext } from "@rwatt451/ordercloud-react";
import { FC, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
// import LoginModal from "../components/Login/LoginModal";
import MainMenu from "./MainMenu";
import LoginModal from "../components/Authentication/LoginModal";

const Layout: FC = () => {
  const { pathname } = useLocation();
  const { allowAnonymous, isAuthenticated, isLoggedIn } =
    useOrderCloudContext();
  const loginDisclosure = useDisclosure();

  useEffect(() => {
    if (!allowAnonymous && !isAuthenticated) {
      loginDisclosure.onOpen();
    } else if (loginDisclosure.isOpen && isLoggedIn) {
      loginDisclosure.onClose();
    }
  }, [loginDisclosure, allowAnonymous, isAuthenticated, isLoggedIn]);

  return (
    <>
      <LoginModal disclosure={loginDisclosure} />
      <MainMenu loginDisclosure={loginDisclosure} />
      <VStack
        alignItems="flex-start"
        w="full"
        minH="100dvh"
        sx={{ "&>*": { width: "full" } }}
        bgColor="chakra-subtle-bg"
      >
        <Container
          maxW={pathname === "/" ? "full" : "container.4xl"}
          mx="auto"
          flex="1"
        >
          <Outlet />
        </Container>
        <HStack
          alignItems="center"
          justifyContent="center"
          as="footer"
          py={3}
          zIndex="12"
          bg="gray.50"
        >
          <Text fontWeight="normal" fontSize="sm">
            © Sitcore Inc. 2024
          </Text>
        </HStack>
      </VStack>
    </>
  );
};

export default Layout;
