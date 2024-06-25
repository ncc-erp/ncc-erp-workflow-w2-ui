import type { Meta, StoryObj } from '@storybook/react';
import { SelectField } from './SelectField';


const meta = {
  title: 'W2/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

const statusOptions = [
  {
    value: -1,
    label: 'All status',
  },
  {
    value: 0,
    label: 'Pending',
  },
  {
    value: 1,
    label: 'Approved',
  },
  {
    value: 2,
    label: 'Rejected',
  },
];

export const Default: Story = {
  args: {
    cursor:"pointer",
    isDisabled: false,
    size: 'sm',
    rounded: 'md',
    // value:
    // onChange:{(e)=> onTemplateStatusChange('Status', e.target.value)},
    options:  statusOptions ,
  },
};
