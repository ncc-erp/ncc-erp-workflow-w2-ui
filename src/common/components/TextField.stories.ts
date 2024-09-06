import { type Meta, type StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'W2/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    h: '10',
    isRequired: true,
    label: 'User name',
    placeholder: 'User name',
    fontSize: 15,
    name: 'userName',
    autoComplete: 'off',
  },
};

export const Error: Story = {
  args: {
    h: '10',
    isRequired: true,
    label: 'User name',
    placeholder: 'User name',
    fontSize: 15,
    error: 'You please enter a user name',
    name: 'userName',
    autoComplete: 'off',
  },
};

export const NotRequired: Story = {
  args: {
    h: '10',
    label: 'User name',
    placeholder: 'User name',
    fontSize: 15,
    name: 'userName',
    autoComplete: 'off',
  },
};
