import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { InputDefinition } from 'models/request';
import debounce from 'lodash.debounce';
import { TextField } from 'common/components/TextField';
import { ColorPicker } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | AggregationColor
  ) => {
    setFormState((prevState) => {
      const isColorChange = 'toHex' in event;
      const newState = {
        ...prevState,
        colorCode: isColorChange ? `#${event.toHex()}` : prevState.colorCode,
        title: !isColorChange ? event.target.value : prevState.title,
      };
      debouncedSubmitRef.current(newState.colorCode, newState.title);
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
      });
    }
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
        <ColorPicker
          value={formState.colorCode}
          onChange={handleChange}
          style={{
            marginLeft: '10px',
            cursor: 'pointer',
            borderColor: '#E2E8F0',
          }}
          getPopupContainer={(trigger) => trigger}
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
