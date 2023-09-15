import { Button, Text, VStack } from '@chakra-ui/react';
import { useOfficeEquipmentRequestWorkflow, useOffices, useUserProjects, useUserInfoWithBranch } from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { TextareaField } from 'common/components/TextareaField';
import { TextField } from 'common/components/TextField';
import { useForm } from 'react-hook-form';
import MultiDatePicker, { DateObject } from "react-multi-date-picker";
import Toolbar from "react-multi-date-picker/plugins/toolbar"

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../common/components/DatePicker/style.css';

import { InputDefinition, PropertyDefinition } from 'models/request';
import { IOffices } from 'models/office';
import { IProjects } from 'models/project';
import { parseJwt } from 'utils/parseJwt';
import { ChangeEvent } from 'react';

interface RequestFormProps {
    inputDefinition: InputDefinition | undefined
}

const RequestForm = ({
    inputDefinition
}: RequestFormProps) => {
    const { data: offices } = useOffices();
    const { data: projects } = useUserProjects();
    const userInfo = parseJwt(localStorage.getItem("accessToken"));
    const { data: user } = useUserInfoWithBranch(userInfo.email);

    const {
        isLoading: isLoginLoading,
    } = useOfficeEquipmentRequestWorkflow();
    const getOptions = (type: string) => {
        switch (type) {
            case 'OfficeList':
                return offices?.map((office: IOffices) => ({
                    value: office?.code,
                    label: office?.displayName,
                }));

            case 'MyProject':
                return projects?.map((project: IProjects) => ({
                    value: project?.code,
                    label: project?.name,
                }));
        }
    };

    const {
        handleSubmit,
        register,
    } = useForm({
        defaultValues: {
            ...formParams
        },
    });

    const onSubmit = async () => {
        console.log(formParams);
    };

    const handleDateChange = (newDate: Date | null, variable: string) => {
        formParams[variable] = newDate;
    }

    const handleDatesChange = (newDates: DateObject | DateObject[] | null, variable: string) => {
        formParams[variable] = newDates;
    }

    const handleChangeSelectValue = (e: ChangeEvent<HTMLSelectElement>, variable: string) => {
        formParams[variable] = e.target.value
    }

    const handleChangeTextValue = (e: ChangeEvent<HTMLInputElement>, variable: string) => {
        formParams[variable] = e.target.value
    }

    const handleChangeTextAriaValue = (e: ChangeEvent<HTMLTextAreaElement>, variable: string) => {
        formParams[variable] = e.target.value
    }
    var formParams: any = {};

    const getField = (Field: PropertyDefinition) => {
        const fieldname = (Field?.name) ? Field.name : "";
        switch (Field?.type) {
            case "OfficeList":
            case "MyProject":
                formParams[fieldname] = user?.branch;
                return <>
                    <Text whiteSpace="nowrap" fontSize="md">
                        {fieldname}
                        {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                    </Text>
                    <SelectField
                        size="sm"
                        rounded="md"
                        options={ getOptions(Field?.type) ?? [{ value: "", label: "" }] }
                        value={user?.branch}
                        {...register(fieldname, {
                            required: `${fieldname} is required`,
                        })}
                        onChange={(newValue) => handleChangeSelectValue(newValue, fieldname)}
                    />
                </>;
            case "Text":
                formParams[fieldname] = '';
                return <>
                    <Text whiteSpace="nowrap" fontSize="md">
                        {fieldname}
                        {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                    </Text>
                    <TextField
                        h="50px"
                        placeholder={fieldname}
                        fontSize="sm"
                        {...register(fieldname, {
                            required: `${fieldname} is required`,
                        })}
                        onChange={(newValue) => handleChangeTextValue(newValue, fieldname)}
                    />
                </>
            case "RichText":
                formParams[fieldname] = '';
                return <>
                    <Text whiteSpace="nowrap" fontSize="md">
                        {fieldname}
                        {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                    </Text>
                    <TextareaField
                        {...register(fieldname, {
                            required: `${fieldname} is required`,
                        })}
                        onChange={(newValue) => handleChangeTextAriaValue(newValue, fieldname)}
                    />
                </>
            case "DateTime":
                formParams[fieldname] = new Date();
                if (fieldname != "Dates")
                    return <>
                        <Text whiteSpace="nowrap" fontSize="md">
                            {Field?.name}
                            {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                        </Text>
                        <DatePicker
                            className="datePicker"
                            selected={formParams[fieldname]}
                            onChange={(newDate) => handleDateChange(newDate, fieldname)}
                            dateFormat="dd-MM-yyyy"
                        />
                    </>
                else
                    return <>
                        <Text whiteSpace="nowrap" fontSize="md">
                            {Field?.name}
                            {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                        </Text>
                        <MultiDatePicker
                            multiple
                            value={formParams[fieldname]}
                            onChange={(newDates) => handleDatesChange(newDates, fieldname)}
                            plugins={[
                                <Toolbar
                                    position="bottom"
                                    sort={["close"]}
                                />,
                            ]}
                            style={{
                                width: "100%",
                                height: "32px",
                                borderRadius: "5px",
                                fontSize: "16px",
                                padding: "3px 10px",
                            }}
                        />
                    </>
        }
    }

    const renderFormContent = (Fields: PropertyDefinition[] | undefined) => {
        return Fields?.map(function (Field: PropertyDefinition) {
            return getField(Field)
        });
    }

    return (
        <form
            style={{ width: '100%', marginBottom: '20px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <VStack spacing="14px" alignItems="flex-start">
                {renderFormContent(inputDefinition?.propertyDefinitions)}
                <Button
                    mt="14px"
                    h="50px"
                    type="submit"
                    isLoading={isLoginLoading}
                    colorScheme="blackButton"
                    w="full"
                    textColor="white"
                >
                    Save
                </Button>
            </VStack>
        </form>
    );
};

export default RequestForm;
