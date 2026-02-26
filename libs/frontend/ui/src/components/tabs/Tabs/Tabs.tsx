/**
 * @biosstel/ui - Tabs
 * Tab bar: list of tab buttons. Content is rendered by the consumer.
 */

import { TabButton } from '../TabButton';

export interface TabItem {
  key: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeKey, onSelect, className = '' }: TabsProps) => (
  <div className={`flex gap-2 border-b border-gray-200 ${className}`.trim()}>
    {tabs.map((tab) => (
      <TabButton
        key={tab.key}
        active={activeKey === tab.key}
        onClick={() => onSelect(tab.key)}
      >
        {tab.label}
      </TabButton>
    ))}
  </div>
);
