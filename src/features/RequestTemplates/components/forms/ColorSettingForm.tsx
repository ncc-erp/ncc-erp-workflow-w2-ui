import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { InputDefinition } from 'models/request';
import debounce from 'lodash.debounce';

interface ColorSettingFormProps {
  OnColorSubmit: (colorCode: string) => void;
  inputDefinition?: InputDefinition;
}

export const ColorSettingForm = ({
  inputDefinition,
  OnColorSubmit,
}: ColorSettingFormProps) => {
  const [colorCode, setColorCode] = useState<string>('#aabbcc');
  const [nameRequest, setNameRequest] = useState<string>('Name request');

  const debouncedColorSubmitRef = useRef(
    debounce((color: string) => OnColorSubmit(color), 300)
  );

  useEffect(() => {
    debouncedColorSubmitRef.current = debounce(
      (color: string) => OnColorSubmit(color),
      300
    );
  }, [OnColorSubmit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor: string = event.target.value;
    setColorCode(newColor);
    debouncedColorSubmitRef.current(newColor);
  };

  useEffect(() => {
    const colorSetting: string = inputDefinition?.settings?.color ?? '#aabbcc';
    setColorCode(colorSetting);
    setNameRequest(inputDefinition?.nameRequest ?? 'Name request');
  }, [inputDefinition]);

  return (
    <>
      <FormControl mb="10px" ml={5} display="flex" alignItems="center">
        <FormLabel
          textAlign="left"
          fontSize={16}
          mb={1}
          fontWeight="normal"
          mr={3}
        >
          Settings:
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
          onChange={handleChange}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #E2E8F0 ',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        />
      </FormControl>
    </>
  );
};
