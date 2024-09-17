import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { InputDefinition } from 'models/request';
import debounce from 'lodash.debounce';
import { TextField } from 'common/components/TextField';

interface SettingFormProps {
  onSubmitSettings: (colorCode: string, title: string) => void;
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
  });

  const debouncedSubmitRef = useRef(
    debounce(
      (color: string, title: string) => onSubmitSettings(color, title),
      300
    )
  );

  useEffect(() => {
    debouncedSubmitRef.current = debounce((color: string, title: string) => {
      onSubmitSettings(color, title);
    }, 300);
  }, [onSubmitSettings]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'colorCode') {
      debouncedSubmitRef.current(value, formState.title);
    } else if (name === 'title') {
      debouncedSubmitRef.current(formState.colorCode, value);
    }
  };

  useEffect(() => {
    const {
      settings: { color = '#aabbcc', titleTemplate = '' } = {},
      nameRequest = 'Name request',
    } = inputDefinition || {};

    setFormState({
      colorCode: color,
      title: titleTemplate,
      nameRequest: nameRequest,
    });
  }, [inputDefinition]);

  return (
    <FormControl
      mb="10px"
      ml={5}
      display="flex"
      flexDirection="column"
      gap={3}
      paddingTop={3}
    >
      <FormControl style={{ display: 'flex', alignItems: 'center' }}>
        <FormLabel
          textAlign="left"
          fontSize={16}
          mb={1}
          fontWeight="normal"
          mr={3}
        >
          Color:
        </FormLabel>
        <Box
          style={{
            backgroundColor: formState.colorCode,
            padding: '2px 9px',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#ffffff',
          }}
        >
          {formState.nameRequest}
        </Box>
        <input
          type="color"
          name="colorCode"
          value={formState.colorCode}
          onChange={handleChange}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #E2E8F0 ',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        />
      </FormControl>
      <FormControl style={{ display: 'flex', alignItems: 'center' }}>
        <FormLabel
          textAlign="left"
          fontSize={16}
          mb={1}
          fontWeight="normal"
          mr={3}
        >
          Title:
        </FormLabel>
        <TextField
          h="40px"
          w="500px"
          fontSize="sm"
          name="title"
          value={formState.title}
          onChange={handleChange}
        />
      </FormControl>
    </FormControl>
  );
};
