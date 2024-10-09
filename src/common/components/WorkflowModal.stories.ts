import { type Meta, type StoryObj } from '@storybook/react';
import { WorkflowModal } from './WorkflowModal';

const meta = {
  title: 'W2/WorkflowModal',
  component: WorkflowModal,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof WorkflowModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    workflow: '234670987654',
  },
};
export const Close: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    workflow: '234670987654',
  },
};
