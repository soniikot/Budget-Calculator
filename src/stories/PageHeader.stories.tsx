import type { Meta, StoryObj } from "@storybook/react";

import { PageHeader } from "../components/Month/PageHeader";

const meta = {
  component: PageHeader,
  parameters: {},
} satisfies Meta<typeof PageHeader>;

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
