import {
  FormControl,
  FormLabel,
  Divider,
  Heading,
  Button,
  Input,
  Flex,
  Box,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { personalInfoSchema } from "utils/yup";

interface IFormPersonal {
  email: string;
  name?: string;
  phoneNumber?: string;
  surname?: string;
  userName: string;
}

const FormInfo = () => {
  const methods = useForm<IFormPersonal>({
    resolver: yupResolver(personalInfoSchema),
    // defaultValues: {
    //   samples: [{ volume: "" }],
    // },
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  function onSubmit(values: IFormPersonal) {
    console.log(values);
  }
  return (
    <>
      <Heading>Personal info</Heading>
      <Divider mb={5} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <Flex flexDirection={"column"} gap={5}>
            <Box>
              <FormLabel htmlFor="userName">Username *</FormLabel>
              <Input
                isInvalid={errors?.userName as boolean | undefined}
                id="userName"
                placeholder="Username"
                {...register("userName")}
              />
              <Box fontSize={14} color={"red.500"} position={"absolute"}>
                {errors?.userName && (errors?.userName?.message as string)}
              </Box>
            </Box>
            <Flex gap={5}>
              <Box w={"50%"}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" placeholder="Name" />
              </Box>
              <Box w={"50%"}>
                <FormLabel htmlFor="surname">Surname</FormLabel>
                <Input id="surname" placeholder="Surname" />
              </Box>
            </Flex>
            <Box>
              <FormLabel htmlFor="email">Email *</FormLabel>
              <Input
                isInvalid={errors?.email as boolean | undefined}
                id="email"
                placeholder="Email"
                {...register("email")}
              />
              <Box fontSize={14} color={"red.500"} position={"absolute"}>
                {errors?.email && (errors?.email?.message as string)}
              </Box>
            </Box>
            <Box>
              <FormLabel htmlFor="phone">Phone number</FormLabel>
              <Input id="phone" placeholder="Phone number" />
            </Box>
          </Flex>
        </FormControl>
        <Button
          mt={7}
          colorScheme="blue"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default FormInfo;
