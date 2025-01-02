import type { Meta, StoryObj } from "@storybook/react";

import { TransactionForm } from "../components/Month/TransactionForm";

const meta = {
  component: TransactionForm,
  parameters: {},
} satisfies Meta<typeof TransactionForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const March: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [
          ["year", "2024"],
          ["month", "3"],
        ],
      },
    },
  },
};
