import { Box, Checkbox, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { InputDefinition } from 'models/request';
import debounce from 'lodash.debounce';
import { TextField } from 'common/components/TextField';
import { ColorPicker } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

interface SettingFormProps {
  onSubmitSettings: (
    colorCode: string,
    title: string,
    isSendKomuMessage: boolean
  ) => void;
  inputDefinition?: InputDefinition;
}

export const SettingForm = ({
  inputDefinition,
  onSubmitSettings,
}: SettingFormProps) => {
  const [formState, setFormState] = useState({
    colorCode: '#aabbcc',
    nameRequest: 'Name request',
    title: '',
    isSendKomuMessage: false,
  });

  const debouncedSubmitRef = useRef(
    debounce(
      (color: string, title: string, isSendKomuMessage: boolean) =>
        onSubmitSettings(color, title, isSendKomuMessage),
      300
    )
  );

  useEffect(() => {
    debouncedSubmitRef.current = debounce(
      (color: string, title: string, isSendKomuMessage: boolean) => {
        onSubmitSettings(color, title, isSendKomuMessage);
      },
      300
    );
  }, [onSubmitSettings]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | AggregationColor,
    name: string
  ) => {
    setFormState((prevState) => {
      const newState = {
        ...prevState,
        colorCode:
          name === 'colorCode'
            ? `#${(event as AggregationColor).toHex()}`
            : prevState.colorCode,
        title:
          name === 'title'
            ? (event as React.ChangeEvent<HTMLInputElement>).target.value
            : prevState.title,
        isSendKomuMessage:
          name === 'isSendKomuMessage'
            ? (event as React.ChangeEvent<HTMLInputElement>).target.checked
            : prevState.isSendKomuMessage,
      };
      debouncedSubmitRef.current(
        newState.colorCode,
        newState.title,
        newState.isSendKomuMessage
      );
      return newState;
    });
  };

  useEffect(() => {
    if (inputDefinition) {
      const { settings, nameRequest } = inputDefinition;

      setFormState({
        colorCode: settings?.color ?? '#aabbcc',
        title: settings?.titleTemplate ?? '',
        nameRequest: nameRequest ?? 'Name request',
        isSendKomuMessage: settings?.isSendKomuMessage ?? false,
      });
    }
  }, [inputDefinition]);

  return (
    <Flex pt="16px" pb="24px" flexDirection="column" gap="12px">
      <FormControl display="flex" alignItems="center">
        <FormLabel
          textAlign="left"
          fontSize={['sm', 'md']}
          fontWeight="normal"
          mr={3}
          mb={0}
        >
          Color:
        </FormLabel>
        <Box
          bg={formState.colorCode}
          p="2px 8px"
          borderRadius="full"
          fontSize="xs"
          textAlign="center"
          fontWeight="semibold"
          color="white"
        >
          {formState.nameRequest}
        </Box>
        <ColorPicker
          value={formState.colorCode}
          onChange={(e) => handleChange(e, 'colorCode')}
          style={{
            marginLeft: '10px',
            cursor: 'pointer',
            borderColor: '#E2E8F0',
          }}
          getPopupContainer={(trigger) => trigger}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel
          textAlign="left"
          fontSize={['sm', 'md']}
          fontWeight="normal"
          mb={0}
          mr={3}
        >
          Send Komu Message:
        </FormLabel>
        <Checkbox
          size="lg"
          isChecked={formState.isSendKomuMessage}
          name="isSendKomuMessage"
          onChange={(e) => handleChange(e, 'isSendKomuMessage')}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel
          textAlign="left"
          fontSize={16}
          fontWeight="normal"
          mb={0}
          mr={3}
        >
          Title:
        </FormLabel>
        <Box flex="1">
          <TextField
            h="40px"
            maxWidth="500px"
            fontSize="sm"
            name="title"
            value={formState.title}
            onChange={(e) => handleChange(e, 'title')}
          />
        </Box>
      </FormControl>
    </Flex>
  );
};
