import type { Preview } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../libs/frontend/shell/src/store';
import './storybook.css';

class StorybookErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui', color: '#c00' }}>
          <h2>Error en la story</h2>
          <pre style={{ overflow: 'auto', fontSize: 12 }}>
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider store={store}>
        <StorybookErrorBoundary>
          <Story />
        </StorybookErrorBoundary>
      </Provider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
