import {
  CardBody,
  Divider,
  Image,
  Card,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import FormInfo from "../components/FormInfo";
import { FiUser, FiEdit } from "react-icons/fi";
import FormChangePassword from "../components/FormChangePassword";
import { useState } from "react";

interface IManage {
  text: string;
  icon: JSX.Element;
  component: JSX.Element;
}
const listManage = [
  { text: "Personal info", icon: <FiEdit />, component: <FormInfo /> },
  {
    text: "Change password",
    icon: <FiUser />,
    component: <FormChangePassword />,
  },
];

const Manage = () => {
  const [indexTab, setIndexTab] = useState<number>(0);

  return (
    <Flex
      w={["100%", "90%", "90%", "75%"]}
      gap={5}
      flexDirection={["column", "row"]}
    >
      <Card w={["100%", "50%", "50%", "25%"]}>
        <CardBody>
          <Flex alignItems={"center"} flexDirection={"column"}>
            <Image boxSize={["30%", "50%"]} src="/public/logo.png" />
            <Text fontSize={18} fontWeight={500} my={2}>
              NCC SOFT
            </Text>
            <Divider my={4} />
          </Flex>
          {listManage.map((item: IManage, index: number) => {
            return (
              <Flex
                key={index}
                alignItems={"center"}
                cursor={"pointer"}
                mt={1}
                gap={2}
                p={2}
                borderRadius={5}
                _hover={{
                  background: "#3182ce",
                  color: "white",
                }}
                bg={indexTab === index ? "#3182ce" : ""}
                color={indexTab === index ? "white" : ""}
                onClick={() => setIndexTab(index)}
              >
                {item?.icon}
                <Text fontSize={18} fontWeight={500} mt={2} margin={0}>
                  {item?.text}
                </Text>
              </Flex>
            );
          })}
        </CardBody>
      </Card>
      <Card w={["100%", "75%"]}>
        <CardBody>
          {listManage?.map((item: IManage, index: number) => {
            return (
              <Box display={indexTab === index ? "block" : "none"} key={index}>
                {item?.component}
              </Box>
            );
          })}
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Manage;
