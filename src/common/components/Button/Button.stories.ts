import type { Meta, StoryObj } from '@storybook/react';
import { CustomButton } from './Button';

const meta = {
  title: 'W2/CustomButton',
  component: CustomButton,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof CustomButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonPrimary: Story = {
  args: {
    children: 'Test Button',
    variant: 'brandPrimary',
    size: 'md',
    isDisabled: false,
  },
};

export const ButtonDestructive: Story = {
  args: {
    children: 'Test Button',
    variant: 'brandDestructive',
    size: 'md',
    isDisabled: false,
  },
};

export const ButtonSecondary: Story = {
  args: {
    children: 'Test Button',
    variant: 'brandSecondary',
    size: 'md',
    isDisabled: false,
  },
};
