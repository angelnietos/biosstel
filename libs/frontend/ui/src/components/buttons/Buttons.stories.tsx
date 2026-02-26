import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonPrimaryLg } from './ButtonPrimaryLg';
import { ButtonPrimaryMini } from './ButtonPrimaryMini';
import { ButtonSecondary } from './ButtonSecondary';
import { ButtonSecondaryLg } from './ButtonSecondaryLg';
import { ButtonSecondaryMini } from './ButtonSecondaryMini';
import { ButtonCancel } from './ButtonCancel';
import { ButtonCancelLg } from './ButtonCancelLg';
import { ButtonCancelMini } from './ButtonCancelMini';
import { ButtonAddPrimary } from './ButtonAddPrimary';
import { ButtonAddSecondary } from './ButtonAddSecondary';
import { ButtonAddTertiary } from './ButtonAddTertiary';
import { ButtonSupport } from './ButtonSupport';
import { ButtonAvatar } from './ButtonAvatar';
import { ButtonBack } from './ButtonBack';
import { ButtonEdit } from './ButtonEdit';
import { ButtonActivate } from './ButtonActivate';
import { AllSelectionButtonPair } from './AllSelectionButtonPair';

const meta: Meta = {
  title: 'UI/Buttons',
  parameters: { layout: 'padded' },
};

export default meta;

export const Primary: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ButtonPrimary>Primary</ButtonPrimary>
      <ButtonPrimary disabled>Disabled</ButtonPrimary>
    </div>
  ),
};

export const PrimaryLg: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3 max-w-xs">
      <ButtonPrimaryLg>Primary Large</ButtonPrimaryLg>
      <ButtonPrimaryLg disabled>Disabled</ButtonPrimaryLg>
    </div>
  ),
};

export const PrimaryMini: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ButtonPrimaryMini>Mini</ButtonPrimaryMini>
      <ButtonPrimaryMini disabled>Disabled</ButtonPrimaryMini>
    </div>
  ),
};

export const Secondary: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ButtonSecondary>Secondary</ButtonSecondary>
      <ButtonSecondaryLg>Secondary Lg</ButtonSecondaryLg>
      <ButtonSecondaryMini>Secondary Mini</ButtonSecondaryMini>
    </div>
  ),
};

export const Cancel: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ButtonCancel>Cancel</ButtonCancel>
      <ButtonCancelLg>Cancel Lg</ButtonCancelLg>
      <ButtonCancelMini>Cancel Mini</ButtonCancelMini>
    </div>
  ),
};

export const Add: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ButtonAddPrimary>Add Primary</ButtonAddPrimary>
      <ButtonAddSecondary>Add Secondary</ButtonAddSecondary>
      <ButtonAddTertiary>Add Tertiary</ButtonAddTertiary>
    </div>
  ),
};

export const Utility: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonSupport />
      <ButtonSupport disabled />
      <ButtonAvatar>Usuario</ButtonAvatar>
      <ButtonBack href="#">Volver</ButtonBack>
      <ButtonEdit />
      <ButtonEdit disabled />
      <ButtonActivate active />
      <ButtonActivate active={false} />
    </div>
  ),
};

export const AllSelectionPair: StoryObj = {
  render: function AllSelectionPairStory() {
    const [index, setIndex] = useState<0 | 1>(0);
    return (
      <AllSelectionButtonPair
        labels={['Opción A', 'Opción B']}
        activeIndex={index}
        onChange={setIndex}
      />
    );
  },
};
