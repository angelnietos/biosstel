import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  parameters: { layout: 'padded' },
};

export default meta;

export const Default: StoryObj<typeof SearchInput> = {
  args: {
    name: 'search',
    placeholder: 'Buscar...',
  },
};
