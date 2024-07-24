import type { Meta, StoryObj } from '@storybook/react';
import BadgeStatus from './StatusButton';

const meta = {
  title: 'W2/BadgeStatus',
  component: BadgeStatus,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof BadgeStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Approved: Story = {
  args: {
    status: 'Approved',
    children: 'Approved',
  },
};

export const Pending: Story = {
  args: {
    status: 'Pending',
    children: 'Pending',
  },
};

export const Rejected: Story = {
  args: {
    status: 'Rejected',
    children: 'Rejected',
  },
};

export const Canceled: Story = {
  args: {
    status: 'Canceled',
    children: 'Canceled',
  },
};
