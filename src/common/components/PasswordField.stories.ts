import { PasswordField } from './PasswordField';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'W2/PasswordField',
  component: PasswordField,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    h: '10',
    label: 'Password',
    placeholder: 'Password',
    fontSize: 15,
    name: 'password',
    autoComplete: 'off',
  },
};
export const Error: Story = {
  args: {
    h: '10',
    label: 'Password',
    placeholder: 'Password',
    fontSize: 15,
    error: 'Error',
    name: 'password',
    autoComplete: 'off',
  },
};
