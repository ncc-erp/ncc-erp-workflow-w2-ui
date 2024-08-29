import { Box, Button, FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ColorPickerModal } from '../modals/ColorPickerModal';
import { InputDefinition } from 'models/request';

interface ColorSettingFormProps {
  OnColorSubmit: (colorCode: string) => void;
  inputDefinition?: InputDefinition;
}

export const ColorSettingForm = ({
  inputDefinition,
  OnColorSubmit,
}: ColorSettingFormProps) => {
  const [isColorPickerModalOpen, setIsColorPickerModalOpen] =
    useState<boolean>(false);
  const [colorCode, setColorCode] = useState<string>('#FFF');

  useEffect(() => {
    if (inputDefinition && inputDefinition.settings) {
      try {
        const jsonSetting = JSON.parse(inputDefinition.settings);
        if (jsonSetting && jsonSetting.color) {
          setColorCode(jsonSetting.color);
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, [inputDefinition]);

  const onOpenColorPickerModal = () => {
    setIsColorPickerModalOpen(true);
  };

  const onCloseColorPickerModal = () => {
    setIsColorPickerModalOpen(false);
  };

  const onColorSave = (colorCode: string) => {
    if (colorCode) {
      setColorCode(colorCode);
      OnColorSubmit(colorCode);
    }
  };

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
            padding: '7px',
            borderRadius: '5px',
            textAlign: 'center',
          }}
        >
          {colorCode ? colorCode : ''}
        </Box>
        <Button ml={5} w="16%" onClick={onOpenColorPickerModal}>
          Change color
        </Button>
      </FormControl>
      <ColorPickerModal
        isOpen={isColorPickerModalOpen}
        onClose={onCloseColorPickerModal}
        OnColorSave={onColorSave}
      />
    </>
  );
};
