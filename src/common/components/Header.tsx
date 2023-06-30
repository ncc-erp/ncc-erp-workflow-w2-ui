import {
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Button,
  Image,
  Flex,
  Icon,
  Menu,
  Box,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdSettings, MdLogout } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { urls } from "common/constants/urls";
import { useEffect, useState } from "react";
import { PiListBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { useClearUserData } from "stores/user";
import { useCurrentUser } from "api/apiHooks/userHooks";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearUser = useClearUserData();
  const { remove } = useCurrentUser();

  const [toggle, setToggle] = useState<boolean>(false);

  const onLogout = () => {
    clearUser();
    navigate('/login');
    remove();
  };

  useEffect(() => {
    setToggle(false);
  }, [location.pathname]);

  return (
    <Box
      boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
      position={["sticky", "relative"]}
      display={"flex"}
      zIndex={2}
      color="rgba(255,255,255,.55);"
      left={0}
      top={0}
      bg="#222834"
      py={4}
      px={["12px", "10%"]}
      mb={5}
      w="100%"
      h={"75px"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"100%"}>
        <Flex
          onClick={() => navigate(urls.REQUEST_TEMPLATES)}
          fontWeight={600}
          fontSize={22}
          position={"relative"}
          cursor={"pointer"}
          zIndex={2}
          gap={2}
        >
          <Image src="/logo.png" w={"32px"} />
          NCC Workflow
        </Flex>
        <Button
          onClick={() => setToggle(!toggle)}
          borderColor="green.500"
          position={"relative"}
          fontSize={30}
          display={["flex", "none"]}
          height="48px"
          border="2px"
          zIndex={2}
          width="48px"
        >
          <Icon as={toggle ? AiOutlineClose : PiListBold} />
        </Button>

        <Box
          justifyContent={"space-between"}
          alignItems={"center"}
          transition={["all 0.2s ease-in-out", "none"]}
          position={["fixed", "initial"]}
          display={["", "flex"]}
          zIndex={1}
          left={toggle ? 0 : "100%"}
          top={0}
          bg={"#222834"}
          mt={["75px", 0]}
          w={["100vw", "60%"]}
          h={["100vh", "0"]}
        >
          <Flex
            flexDirection={["column", "row"]}
            gap={5}
            fontSize={[20, 18]}
            p={[5, 0]}
          >
            <Button
              onClick={() => navigate(urls.REQUEST_TEMPLATES)}
              colorScheme="whiteAlpha"
              variant="ghost"
            >
              Request Templates
            </Button>
            <Button
              onClick={() => navigate(urls.MY_REQUESTS)}
              colorScheme="whiteAlpha"
              variant="ghost"
            >
              My Requests
            </Button>
            <Button
              onClick={() => navigate(`${urls.ACCOUNT}/Manage`)}
              display={["block", "none"]}
              colorScheme="whiteAlpha"
              variant="ghost"
            >
              My Account
            </Button>
            <Button
              display={["block", "none"]}
              colorScheme="whiteAlpha"
              variant="ghost"
              onClick={onLogout}
            >
              Logout
            </Button>
          </Flex>
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="whiteAlpha"
              variant="ghost"
              display={["none", "block"]}
            >
              <Flex alignItems={"center"} gap={3} fontSize={18}>
                <Icon as={FaUserCircle} />
                Profile
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem
                  color={"black"}
                  fontWeight={500}
                  onClick={() => navigate(`${urls.ACCOUNT}/Manage`)}
                >
                  <Icon as={MdSettings} mr={2} />
                  My Account
                </MenuItem>
                <MenuItem color={"black"} fontWeight={500}>
                  <Icon as={MdLogout} mr={2} />
                  Logout
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
