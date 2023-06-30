import {
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  FormControl,
  ModalFooter,
  ModalHeader,
  FormLabel,
  ModalBody,
  Button,
  Select,
  Modal,
  Input,
} from "@chakra-ui/react";
import { formatsQuill, modulesQuill } from "common/constants/others";
import { InputTemplatesTypes } from "common/constants/type";
import { FormField, IFormRequest, IPropertyDefinition } from "common/interface";
import { Controller, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requestModal: {
    title: string;
    inputs: IPropertyDefinition[];
  };
}

const ModalRequest = ({ isOpen, onClose, requestModal }: Props) => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm();

  function onSubmit(values: Partial<IFormRequest>) {
    console.log(values);
  }

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={0}>{requestModal?.title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            {requestModal?.inputs?.map((item: IPropertyDefinition, index) => {
              const name = item?.name as FormField;
              return (
                <FormControl
                  key={index}
                  isRequired={item?.isRequired}
                  mt={4}
                  h={item?.type === InputTemplatesTypes.RICH_TEXT ? 275 : ""}
                >
                  <FormLabel>
                    {item?.name?.replace(/([A-Z])/g, " $1").trim()}
                  </FormLabel>
                  {item?.type === InputTemplatesTypes.OFFICE_LIST && (
                    <Controller
                      control={control}
                      name={name}
                      render={({ field }) => (
                        <Select placeholder="Select office" {...field}>
                          <option value="office1">Office 1</option>
                          <option value="office2">Office 2</option>
                          <option value="office3">Office 3</option>
                        </Select>
                      )}
                    />
                  )}
                  {item?.type === InputTemplatesTypes.MY_PROJECT && (
                    <Controller
                      control={control}
                      name={name}
                      render={({ field }) => (
                        <Select placeholder="Select project" {...field}>
                          <option value="project1">Project 1</option>
                          <option value="project2">Project 2</option>
                          <option value="project3">Project 3</option>
                        </Select>
                      )}
                    />
                  )}
                  {item?.type === InputTemplatesTypes.TEXT && (
                    <Input type="text" {...register(name)} />
                  )}
                  {item?.type === InputTemplatesTypes.RICH_TEXT && (
                    <Controller
                      control={control}
                      name={name}
                      render={({ field }) => (
                        <ReactQuill
                          formats={formatsQuill}
                          modules={modulesQuill}
                          style={{ height: "200px" }}
                          theme="snow"
                          {...field}
                        />
                      )}
                    />
                  )}
                  {item?.type === InputTemplatesTypes.DATE_TIME && (
                    <Input
                      placeholder="Select Date"
                      type="date"
                      {...register(name)}
                    />
                  )}
                </FormControl>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ModalRequest;
