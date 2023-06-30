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
import { changePasswordSchema } from "utils/yup";

interface IFormChangePassword {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const FormChangePassword = () => {
  const methods = useForm<IFormChangePassword>({
    resolver: yupResolver(changePasswordSchema),
    // defaultValues: {
    //   samples: [{ volume: "" }],
    // },
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  function onSubmit(values: IFormChangePassword) {
    console.log(values);
  }
  return (
    <>
      <Heading>Change password</Heading>
      <Divider mb={5} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <Flex flexDirection={"column"} gap={5}>
            <Box>
              <FormLabel htmlFor="currentPassword">
                Current password *
              </FormLabel>
              <Input
                isInvalid={errors?.currentPassword as boolean | undefined}
                id="currentPassword"
                placeholder="Current password"
                {...register("currentPassword")}
              />
              <Box fontSize={14} color={"red.500"} position={"absolute"}>
                {errors?.newPassword &&
                  (errors?.currentPassword?.message as string)}
              </Box>
            </Box>
            <Box>
              <FormLabel htmlFor="newPassword">New password *</FormLabel>
              <Input
                isInvalid={errors?.newPassword as boolean | undefined}
                id="newPassword"
                placeholder="New password"
                {...register("newPassword")}
              />
              <Box fontSize={14} color={"red.500"} position={"absolute"}>
                {errors?.newPassword &&
                  (errors?.newPassword?.message as string)}
              </Box>
            </Box>
            <Box>
              <FormLabel htmlFor="newPasswordConfirm">
                Confirm new password *
              </FormLabel>
              <Input
                isInvalid={errors?.newPasswordConfirm as boolean | undefined}
                id="newPasswordConfirm"
                placeholder="Confirm new password"
                {...register("newPasswordConfirm")}
              />
              <Box fontSize={14} color={"red.500"} position={"absolute"}>
                {errors?.newPasswordConfirm &&
                  (errors?.newPasswordConfirm?.message as string)}
              </Box>
            </Box>
          </Flex>
          <Button
            mt={7}
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </FormControl>
      </form>
    </>
  );
};

export default FormChangePassword;
