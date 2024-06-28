import type { Meta, StoryObj } from '@storybook/react';
import { TextareaField } from './TextareaField';


const meta = {
  title: 'W2/TextareaField',
  component: TextareaField,
  parameters: {
    layout: 'centered',
  },
 
  tags: ['autodocs'],
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
  args: {
    // primary: true,
    label: 'Text area',
  },
};

