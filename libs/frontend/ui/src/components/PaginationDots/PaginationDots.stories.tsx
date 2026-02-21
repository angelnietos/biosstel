import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PaginationDots } from './index';

const meta: Meta<typeof PaginationDots> = {
  component: PaginationDots,
  title: 'UI/PaginationDots',
};

export default meta;

type Story = StoryObj<typeof PaginationDots>;

export const Default: Story = {
  args: { total: 5, current: 0 },
};

export const Interactive: StoryObj = {
  render: function Interactive() {
    const [current, setCurrent] = useState(0);
    const total = 5;
    return (
      <div>
        <div className="flex gap-2 mb-4">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className="px-3 py-1 rounded bg-gray-200 text-sm"
            >
              {i + 1}
            </button>
          ))}
        </div>
        <PaginationDots total={total} current={current} />
      </div>
    );
  },
};
