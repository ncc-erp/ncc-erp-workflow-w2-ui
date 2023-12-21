import type { Meta, StoryObj } from '@storybook/react';
import { SideNav } from 'common/components/SideBar';


const meta = {
  title: 'W2/SlideBar',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {};
