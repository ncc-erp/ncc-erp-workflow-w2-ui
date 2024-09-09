import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from '../style.module.scss';
interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  OnColorSave: (colorCode: string) => void;
}

export const ColorPickerModal = ({
  isOpen,
  onClose,
  OnColorSave,
}: ColorPickerModalProps) => {
  const [color, setColor] = useState('#aabbcc');
  const onColorChange = () => {
    OnColorSave(color);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent className={styles.customModal}>
        <ModalHeader fontSize="md">Change color settings:</ModalHeader>
        <Divider></Divider>
        <ModalCloseButton />
        <ModalBody>
          <HexColorPicker
            style={{ width: 'auto', marginTop: '5px' }}
            color={color}
            onChange={setColor}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: color,
                width: '100%',
                padding: '10px',
                marginTop: '30px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              {color}
            </div>
            <Button
              mb={5}
              mt={5}
              w="20%"
              colorScheme="green"
              onClick={onColorChange}
            >
              Save
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
