import { Button, Text, VStack } from '@chakra-ui/react';
import { useOfficeEquipmentRequestWorkflow } from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { TextareaField } from 'common/components/TextareaField';
import { TextField } from 'common/components/TextField';
import { useForm } from 'react-hook-form';
import MultiDatePicker from "react-multi-date-picker";
import Toolbar from "react-multi-date-picker/plugins/toolbar"

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../common/components/DatePicker/style.css';

import { office, project } from 'common/constants';
import 'react-datepicker/dist/react-datepicker.css';
import { InputDefinition } from 'models/request';

interface RequestFormProps {
    inputDefinition: InputDefinition | undefined
}

const RequestForm = ({
    inputDefinition
}: RequestFormProps) => {
    const {
        isLoading: isLoginLoading,
    } = useOfficeEquipmentRequestWorkflow();

    const getOptions = (type: any) => {
        let data: any;
        switch (type) {
            case 'OfficeList':
                data = office;
                break;

            case 'MyProject':
                data = project;
                break;
        }
        const options = Object.values(data).map((x: any) => ({
            value: x.value,
            label: x.label,
        }));
        return options;
    };

    const {
        handleSubmit,
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

    const handleDatesChange = (newDates: any, variable: string) => {
        formParams[variable] = newDates; 
    }

    var formParams: any = {};

    const getField = (Field: any) => {
        const fieldname = (Field?.name) ? Field.name : "";
        switch (Field?.type) {
            case "OfficeList":
            case "MyProject":
                formParams[fieldname] = '';
                return <>
                    <Text whiteSpace="nowrap" fontSize="md">
                        {Field?.name}
                        {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                    </Text>
                    <SelectField
                        size="sm"
                        rounded="md"
                        options={getOptions(Field?.type)}
                    />
                </>;
            case "Text":
                formParams[fieldname] = '';
                return <>
                    <Text whiteSpace="nowrap" fontSize="md">
                        {Field?.name}
                        {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                    </Text>
                    <TextField
                        h="50px"
                        placeholder={fieldname}
                        fontSize="sm"
                    />
                </>
            case "RichText":
                formParams[fieldname] = '';
                return <>
                    <Text whiteSpace="nowrap" fontSize="md">
                        {Field?.name}
                        {Field?.isRequired ? <span style={{ color: "red" }}> *</span> : ''}
                    </Text>
                    <TextareaField

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

    const renderFormContent = (Fields: any) => {
        return Fields.map(function (Field: any) {
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
