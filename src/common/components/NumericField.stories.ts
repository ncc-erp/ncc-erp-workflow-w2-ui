import { type Meta, type StoryObj } from '@storybook/react';
import { NumericField } from './NumericField';

const meta = {
  title: 'W2/NumericField',
  component: NumericField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NumericField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    h: '10',
    isRequired: true,
    label: 'Age',
    placeholder: 'Enter your age',
    fontSize: 15,
    name: 'age',
    autoComplete: 'off',
  },
};

export const Error: Story = {
  args: {
    h: '10',
    isRequired: true,
    label: 'Age',
    placeholder: 'Enter your age',
    fontSize: 15,
    error: 'Please enter a valid age',
    name: 'age',
    autoComplete: 'off',
  },
};

export const NotRequired: Story = {
  args: {
    h: '10',
    label: 'Age',
    placeholder: 'Enter your age',
    fontSize: 15,
    name: 'age',
    autoComplete: 'off',
  },
};
