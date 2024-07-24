import { CustomCheckbox } from './CustomCheckbox';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'W2/Checkbox',
  component: CustomCheckbox,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof CustomCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
