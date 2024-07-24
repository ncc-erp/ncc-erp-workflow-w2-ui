import CustomAlert from './CustomAlert';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'W2/CustomAlert',
  component: CustomAlert,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof CustomAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    title: 'Submitted request successfully',
    description:
      'The request has been sent successfully, please wait for PM approval!',
    status: 'success',
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    title: 'Failed to submit request',
    description: 'The request failed to send, please try again later!',
    status: 'error',
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning',
    description:
      'The request has been sent successfully, please wait for PM approval!',
    status: 'warning',
    onClose: () => {},
  },
};
