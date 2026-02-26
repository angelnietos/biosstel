import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DivAnimFade } from './DivAnimFade';
import { DivAnimFadeScale } from './DivAnimFadeScale';
import { DivAnimSlideDown } from './DivAnimSlideDown';
import { DivAnimSlideUp } from './DivAnimSlideUp';
import { DivAnimSlideLeft } from './DivAnimSlideLeft';
import { DivAnimSlideRight } from './DivAnimSlideRight';
import { DivAnimCollapseWidth } from './DivAnimCollapseWidth';

const meta: Meta = {
  title: 'UI/Animations',
  parameters: { layout: 'padded' },
};

export default meta;

const Block = ({ label, className = '' }: { label: string; className?: string }) => (
  <div className={`rounded border border-gray-300 bg-gray-50 p-4 ${className}`}>{label}</div>
);

export const Fade: StoryObj = {
  render: () => (
    <DivAnimFade>
      <Block label="DivAnimFade" />
    </DivAnimFade>
  ),
};

export const FadeScale: StoryObj = {
  render: () => (
    <DivAnimFadeScale>
      <Block label="DivAnimFadeScale" />
    </DivAnimFadeScale>
  ),
};

export const SlideDown: StoryObj = {
  render: () => (
    <DivAnimSlideDown>
      <Block label="DivAnimSlideDown" />
    </DivAnimSlideDown>
  ),
};

export const SlideUp: StoryObj = {
  render: () => (
    <DivAnimSlideUp>
      <Block label="DivAnimSlideUp" />
    </DivAnimSlideUp>
  ),
};

export const SlideLeft: StoryObj = {
  render: () => (
    <DivAnimSlideLeft>
      <Block label="DivAnimSlideLeft" />
    </DivAnimSlideLeft>
  ),
};

export const SlideRight: StoryObj = {
  render: () => (
    <DivAnimSlideRight>
      <Block label="DivAnimSlideRight" />
    </DivAnimSlideRight>
  ),
};

export const CollapseWidth: StoryObj = {
  render: () => (
    <DivAnimCollapseWidth>
      <Block label="DivAnimCollapseWidth" />
    </DivAnimCollapseWidth>
  ),
};

export const WithShowToggle: StoryObj = {
  render: function WithShowToggle() {
    const [show, setShow] = useState(true);
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="rounded bg-gray-800 px-3 py-1 text-white text-sm"
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
        <DivAnimFade show={show}>
          <Block label="Contenido con show={true/false}" />
        </DivAnimFade>
      </div>
    );
  },
};
