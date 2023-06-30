import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Flex } from "@chakra-ui/react";

const Layout = () => {
  return (
    <>
      <Header />
      <Flex justifyContent={"center"}>
        <Outlet />
      </Flex>
    </>
  );
};

export default Layout;
