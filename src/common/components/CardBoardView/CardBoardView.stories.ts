import type { Meta, StoryObj } from '@storybook/react';
import CardBoardView from './CardBoardView';

const meta = {
  title: 'W2/CardBoardView',
  component: CardBoardView,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof CardBoardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeviceRequest: Story = {
  args: {
    task: {
      id: '3a13698e-e138-071d-490e-c8d70b23865b',
      workflowInstanceId: '3a13698d-cd73-50a7-ed5e-bfc09b51dfd7',
      email: '',
      status: 1,
      name: 'Probationary Confirmation Request',
      description: 'HoO Reviews',
      dynamicActionData:
        '[{"name":"StrengthPoints","type":"RichText","isRequired":true,"data":"a"},{"name":"WeaknessPoints","type":"RichText","isRequired":true,"data":"a"}]',
      reason: '',
      creationTime: '2024-06-27T01:49:21.081242Z',
      title: 'msssin an.lethihong@ncc.asia',
      requestId: '3a13698e-e138-071d-490e-c8d70b23865b',
      otherActionSignals: [],
      emailTo: ['thien.dang@ncc.asia'],
      authorName: 'Thien Dang An',
    },
  },
};
