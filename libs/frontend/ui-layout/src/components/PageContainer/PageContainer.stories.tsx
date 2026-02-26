import type { Meta, StoryObj } from '@storybook/react';
import { PageContainer } from './PageContainer';

const meta: Meta<typeof PageContainer> = {
  component: PageContainer,
  title: 'UI Layout/PageContainer',
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] },
  },
};

export default meta;

type Story = StoryObj<typeof PageContainer>;

export const Default: Story = {
  args: {
    children: <p>Contenido de la página con padding y ancho completo.</p>,
  },
};

export const WithMaxWidth: Story = {
  args: {
    maxWidth: 'xl',
    children: (
      <p>Contenido limitado a max-width xl (1280px), centrado.</p>
    ),
  },
};
