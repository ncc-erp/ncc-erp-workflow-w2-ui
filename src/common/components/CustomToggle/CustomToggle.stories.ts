import { CustomToggle } from './CustomToggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'W2/Toggle',
  component: CustomToggle,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof CustomToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isChecked: true,
    size: 'md',
    isDisabled: false,
    isFocusable: false,
  },
};
export const Close: Story = {
  args: {
    isChecked: false,
    isFocusable: false,
    isDisabled: false,
    size: 'md',
  },
};
export const Focus: Story = {
  args: {
    isChecked: true,
    isFocusable: true,
    size: 'md',
  },
};
export const Disabled: Story = {
  args: {
    isChecked: true,
    isDisabled: true,
    size: 'md',
  },
};
