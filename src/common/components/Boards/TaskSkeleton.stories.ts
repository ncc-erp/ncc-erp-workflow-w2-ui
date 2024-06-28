import type { Meta, StoryObj } from '@storybook/react';
import TaskSkeleton from './TaskSkeleton';

const meta = {
  title: 'W2/TaskSkeleton',
  component: TaskSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TaskSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};