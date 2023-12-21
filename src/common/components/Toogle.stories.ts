import { type Meta, type StoryObj } from '@storybook/react';
import { Toggle } from './Toogle';

const meta = {
  title: 'W2/Toogle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    
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
