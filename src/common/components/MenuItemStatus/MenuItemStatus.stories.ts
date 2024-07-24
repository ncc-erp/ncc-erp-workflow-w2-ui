import type { Meta, StoryObj } from '@storybook/react';
import MenuItemStatus from './MenuItemStatus';

const meta = {
  title: 'W2/MenuItemStatus',
  component: MenuItemStatus,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof MenuItemStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Approved: Story = {
  args: {
    status: 'Approved',
    isSelected: true,
  },
};

export const Pending: Story = {
  args: {
    status: 'Pending',
    isSelected: true,
  },
};

export const Rejected: Story = {
  args: {
    status: 'Rejected',
    isSelected: true,
  },
};

export const Canceled: Story = {
  args: {
    status: 'Cancel',
    isSelected: true,
  },
};

export const All: Story = {
  args: {
    status: 'All',
    isSelected: true,
  },
};
