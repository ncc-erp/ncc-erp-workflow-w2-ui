import type { Meta, StoryObj } from '@storybook/react';
import { CardDetails } from '.';

const meta = {
  title: 'W2/CardDetails',
  component: CardDetails,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'CardDetails',
    date: '10/11/2024',
    link: 'https://github.com',
    isUsed: true,
  },
};
