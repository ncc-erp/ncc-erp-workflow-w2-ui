import { type Meta, type StoryObj } from '@storybook/react';
import Dropdown from './Dropdown';

const meta = {
  title: 'W2/CustomDropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusDropdown: Story = {
  args: {
    label: 'Status',
    options: [
      { label: 'All', value: 'All' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Cancelled', value: 'Cancelled' },
    ],
    selectedValue: 'Pending',
    className: 'dropDown_container_status',
    onChange: (value: string) => console.log('Status selected:', value),
    customStyles: {
      borderColor: 'green.500',
      backgroundColor: 'green.50',
    },
  },
};

export const TypeDropdown: Story = {
  args: {
    label: 'Type',
    options: [
      { label: 'All', value: 'All' },
      { label: 'Change office', value: 'Change office' },
      { label: 'Device', value: 'Device' },
      { label: 'Office equipment', value: 'Office equipment' },
      {
        label: 'Probationary confirmation',
        value: 'Probationary confirmation',
      },
      { label: 'Work from home', value: 'Work from home' },
    ],
    selectedValue: 'Change office',
    className: 'dropDown_container_type',
    onChange: (value: string) => console.log('Type selected:', value),
    customStyles: {
      borderColor: 'blue.500',
      backgroundColor: 'blue.50',
    },
  },
};
