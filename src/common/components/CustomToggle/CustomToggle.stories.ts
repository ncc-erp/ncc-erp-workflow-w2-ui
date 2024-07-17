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
    state: 'default',
    size: 'md',
  },
};
export const Close: Story = {
  args: {
    isChecked: false,
    state: 'default',
    size: 'md',
  },
};
export const Focus: Story = {
  args: {
    isChecked: true,
    state: 'focus',
    size: 'md',
  },
};
export const Disabled: Story = {
  args: {
    isChecked: true,
    state: 'disabled',
    size: 'md',
  },
};
export const DisabledClose: Story = {
  args: {
    isChecked: false,
    state: 'disabled',
    size: 'md',
  },
};
