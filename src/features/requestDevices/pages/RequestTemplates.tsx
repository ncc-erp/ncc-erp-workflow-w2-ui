import {
  TableContainer,
  useDisclosure,
  CardHeader,
  CardBody,
  Button,
  Table,
  Tbody,
  Thead,
  Card,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import ModalRequest from "../components/ModalRequest";
import { useState } from "react";
import { IPropertyDefinition } from "common/interface";

// Mock data list template
const data = [
  {
    displayName: "Change Office Request",
    inputDefinition: {
      propertyDefinitions: [
        { name: "CurrentOffice", type: "OfficeList", isRequired: !0 },
        { name: "DestinationOffice", type: "OfficeList", isRequired: !0 },
        { name: "Content", type: "RichText", isRequired: !0 },
        { name: "StartDate", type: "DateTime", isRequired: !0 },
        { name: "EndDate", type: "DateTime", isRequired: !1 },
      ],
    },
  },
  {
    displayName: "Device Request",
    inputDefinition: {
      propertyDefinitions: [
        { name: "CurrentOffice", type: "OfficeList", isRequired: !0 },
        { name: "Project", type: "MyProject", isRequired: !0 },
        { name: "Device", type: "Text", isRequired: !0 },
        { name: "Reason", type: "RichText", isRequired: !0 },
      ],
    },
  },
  {
    displayName: "Office Equipment Request",
    inputDefinition: {
      propertyDefinitions: [
        { name: "CurrentOffice", type: "OfficeList", isRequired: !0 },
        { name: "Equipment", type: "Text", isRequired: !0 },
        { name: "Reason", type: "RichText", isRequired: !0 },
      ],
    },
  },
  {
    displayName: "WFH Request",
    inputDefinition: {
      propertyDefinitions: [
        { name: "CurrentOffice", type: "OfficeList", isRequired: !0 },
        { name: "Project", type: "MyProject", isRequired: !0 },
        { name: "Reason", type: "RichText", isRequired: !0 },
        { name: "Dates", type: "DateTime", isRequired: !0 },
      ],
    },
  },
];

const RequestTemplates = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestModal, setRequestModal] = useState<{
    title: string;
    inputs: IPropertyDefinition[];
  }>({ title: "", inputs: [] });

  return (
    <Card w={["100%", "75%"]}>
      <CardHeader fontSize={20} fontWeight={500}>
        Request Templates
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Display name</Th>
                <Th>&nbsp;</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => (
                <Tr key={index}>
                  <Td>{item?.displayName}</Td>
                  <Td isNumeric>
                    <Button
                      colorScheme="blue"
                      p={0}
                      fontSize={20}
                      onClick={() => {
                        setRequestModal({
                          title: item?.displayName,
                          inputs: item?.inputDefinition?.propertyDefinitions,
                        });
                        onOpen();
                      }}
                    >
                      <FaPlus />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <ModalRequest
          isOpen={isOpen}
          onClose={onClose}
          requestModal={requestModal}
        />
      </CardBody>
    </Card>
  );
};

export default RequestTemplates;
