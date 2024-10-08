import { ModalConfirm } from 'common/components/ModalConfirm';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'W2/ModalConfirm',
  component: ModalConfirm,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof ModalConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    title: 'You so beautiful',
    description: 'Are you sure',
  },
};
export const Close: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    title: 'You so beautiful',
    description: 'Are you sure',
  },
};
