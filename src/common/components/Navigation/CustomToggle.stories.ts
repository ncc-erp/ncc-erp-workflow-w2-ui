import Navigation from './Navigation';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'W2/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
