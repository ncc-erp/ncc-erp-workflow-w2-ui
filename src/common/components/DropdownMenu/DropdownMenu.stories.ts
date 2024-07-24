import { type Meta, type StoryObj } from '@storybook/react';
import { Submenu } from './DropdownMenu';

const meta = {
  title: 'W2/Submenu',
  component: Submenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Submenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubMenu: Story = {};
