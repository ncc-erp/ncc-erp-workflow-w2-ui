import { Button, Checkbox, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { PasswordField } from "common/components/PasswordField";
// import { PasswordField } from "common/components/PasswordField";
import { TextField } from "common/components/TextField";
import { useFormik } from 'formik';
import { ModalUserParams } from "models/userIdentity";
import { validationSchema } from "utils/validationSchema";

interface UserFormProps {
    initialValues: ModalUserParams
}

const UserForm = ({ initialValues }: UserFormProps) => {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            //   handleAction(values);
            console.log(values);
        }
    });
    return (
        <Tabs size='md' variant='enclosed'>
            <TabList>
                <Tab>User information</Tab>
                <Tab>Roles</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <form onSubmit={formik.handleSubmit} >
                        <TextField
                            h="10"
                            label="User name *"
                            placeholder="User name"
                            fontSize="small"
                            error={formik.errors.userName}
                            name="userName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.userName}
                        />
                        <TextField
                            h="10"
                            label="Name"
                            placeholder="Name"
                            fontSize="small"
                            error={formik.errors.name}
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        <TextField
                            h="10"
                            label="Surname"
                            placeholder="Surname"
                            fontSize="small"
                            error={formik.errors.surname}
                            name="surname"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.surname}
                        />
                        <PasswordField
                            h="10"
                            label="Password *"
                            placeholder="Password"
                            fontSize="small"
                            error={formik.errors.password}
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            iconsProps={{
                                w: '18px',
                                h: '18px',
                            }}
                            buttonProps={{
                                mr: '10px',
                            }}
                        />
                        <TextField
                            h="10"
                            label="Email address *"
                            placeholder="Email address"
                            fontSize="small"
                            error={formik.errors.email}
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        <TextField
                            h="10"
                            label="Phone number"
                            placeholder="Phone number"
                            fontSize="small"
                            error={formik.errors.phoneNumber}
                            name="phoneNumber"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phoneNumber}
                        />
                        <Stack mt={5} direction='column'>
                            <Checkbox colorScheme='blue' defaultChecked>
                                Active
                            </Checkbox>
                            <Checkbox colorScheme='blue' defaultChecked>
                                Lock account after failed login attempts
                            </Checkbox>
                        </Stack>
                        <Button my={7} colorScheme='blue' type='submit'>
                            Submit
                        </Button>
                    </form>
                </TabPanel>
                <TabPanel>
                    <Stack mt={5} direction='column'>
                        {rolesList && rolesList.items.slice(0, 2).map((role) =>
                            <Checkbox colorScheme='blue' value={role.id} onChange={() => console.log(role.id)}>
                                {role.name}
                            </Checkbox>
                        )}
                    </Stack>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default UserForm;