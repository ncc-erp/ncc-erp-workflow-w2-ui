import type { Meta, StoryObj } from '@storybook/react';
import BadgeType from './BadgeType';

const meta = {
  title: 'W2/BadgeType',
  component: BadgeType,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof BadgeType>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeviceRequest: Story = {
  args: {
    label: 'Device Request',
  },
};

export const ChangeOfficeRequest: Story = {
  args: {
    label: 'Change Office Request',
  },
};

export const OfficeEquipmentRequest: Story = {
  args: {
    label: 'Office Equipment Request',
  },
};

export const ProbationaryConfirmationRequest: Story = {
  args: {
    label: 'Probationary Confirmation Request',
  },
};

export const WFHRequest: Story = {
  args: {
    label: 'WFH Request',
  },
};
