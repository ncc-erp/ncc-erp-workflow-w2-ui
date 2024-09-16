import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { InputDefinition } from 'models/request';
import debounce from 'lodash.debounce';
import { TextField } from 'common/components/TextField';

interface SettingFormProps {
  OnSettingsSubmit: (colorCode: string, title: string) => void;
  inputDefinition?: InputDefinition;
}

export const SettingForm = ({
  inputDefinition,
  OnSettingsSubmit,
}: SettingFormProps) => {
  const [colorCode, setColorCode] = useState<string>('#aabbcc');
  const [nameRequest, setNameRequest] = useState<string>('Name request');
  const [title, setTitle] = useState<string>('');

  const debouncedSubmitRef = useRef(
    debounce(
      (color: string, title: string) => OnSettingsSubmit(color, title),
      300
    )
  );

  useEffect(() => {
    debouncedSubmitRef.current = debounce((color: string, title: string) => {
      OnSettingsSubmit(color, title);
    }, 300);
  }, [OnSettingsSubmit]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColorCode(newColor);
    debouncedSubmitRef.current(newColor, title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    debouncedSubmitRef.current(colorCode, newTitle);
  };

  useEffect(() => {
    const {
      settings: { color = '#aabbcc', titleTemplate = '' } = {},
      nameRequest = 'Name request',
    } = inputDefinition || {};

    setColorCode(color);
    setTitle(titleTemplate);
    setNameRequest(nameRequest);
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
            backgroundColor: colorCode,
            padding: '2px 9px',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#ffffff',
          }}
        >
          {nameRequest}
        </Box>
        <input
          type="color"
          value={colorCode}
          onChange={handleColorChange}
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
          value={title}
          onChange={handleTitleChange}
        />
      </FormControl>
    </FormControl>
  );
};
