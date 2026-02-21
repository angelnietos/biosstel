/**
 * @biosstel/ui - UI Components Library
 */

// ─── Components ───────────────────────────────────────────────────────────
export { Button, type ButtonProps } from './components/buttons/Button';
export { Card, type CardProps } from './components/Card';
export { Modal, type ModalProps } from './components/Modal';
export { IconButton, type IconButtonProps } from './components/IconButton';
export { Loading, type LoadingProps } from './components/Loading';
export { FeatureLoading, type FeatureLoadingProps } from './components/FeatureLoading';
export { Alert, type AlertProps, type AlertVariant } from './components/Alert';
export { ClockArc, type ClockArcProps } from './components/ClockArc';
export { DepartmentBadge, type DepartmentBadgeProps } from './components/DepartmentBadge';
export { PaginationDots, type PaginationDotsProps } from './components/PaginationDots';
export { Pagination, type PaginationProps } from './components/Pagination';

// ─── Forms ───────────────────────────────────────────────────────────────
export { Input, type InputProps } from './components/forms/Input';
export { NumberInput, type NumberInputProps } from './components/forms/NumberInput';
export { FloatingLabel, type FloatingLabelProps } from './components/forms/FloatingLabel';
export { ErrorFormMsg, type ErrorFormMsgProps } from './components/forms/ErrorFormMsg';
export { Select, type SelectProps, type SelectOption } from './components/forms/Select';
export {
  BasicSelect,
  type BasicSelectProps,
  type BasicSelectOption,
} from './components/forms/BasicSelect';
export {
  DivAnimFade,
  DivAnimFadeScale,
  DivAnimSlideDown,
  DivAnimSlideUp,
  DivAnimSlideLeft,
  DivAnimSlideRight,
  DivAnimCollapseWidth,
} from './components/animations';

export { ToastProvider, useToast, type Toast } from './components/ToastProvider';
export { Tooltip, type TooltipProps } from './components/Tooltip';
export { Chip, type ChipProps } from './components/Chip';
export { ConfirmModal, type ConfirmModalProps } from './components/ConfirmModal';
export { Heading, type HeadingProps } from './components/Heading';
export { Text, type TextProps } from './components/Text';
// ─── Data display ─────────────────────────────────────────────────────────
export { LegendDot, type LegendDotProps } from './components/data-display/LegendDot';
export { ProgressBar, type ProgressBarProps } from './components/data-display/ProgressBar';
export { Skeleton, type SkeletonProps } from './components/data-display/Skeleton';
export { StatusBadge, type StatusBadgeProps } from './components/data-display/StatusBadge';
export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableTh,
  TableCell,
  type TableProps,
} from './components/data-display/Table';

// ─── Buttons (variants) ───────────────────────────────────────────────────
export {
  ButtonPrimary,
  ButtonPrimaryLg,
  ButtonPrimaryMini,
  ButtonSecondary,
  ButtonSecondaryLg,
  ButtonSecondaryMini,
  ButtonCancel,
  ButtonCancelLg,
  ButtonCancelMini,
  ButtonAddPrimary,
  ButtonAddSecondary,
  ButtonAddTertiary,
  ButtonSupport,
  ButtonAvatar,
  ButtonBack,
  ButtonEdit,
  ButtonActivate,
  AllSelectionButtonPair,
} from './components/buttons';

// ─── Forms (continued) ────────────────────────────────────────────────────
export { InputPassword, type InputPasswordProps } from './components/forms/InputPassword';
export { SearchInput, type SearchInputProps } from './components/forms/SearchInput';
export { Dropdown, type DropdownProps } from './components/forms/Dropdown';
export { DateInput, type DateInputProps } from './components/forms/DateInput';

// ─── Tabs ────────────────────────────────────────────────────────────────
export { TabButton, type TabButtonProps } from './components/tabs/TabButton';
export { Tabs, type TabsProps, type TabItem } from './components/tabs/Tabs';

export type {
  ButtonPrimaryProps,
  ButtonPrimaryLgProps,
  ButtonPrimaryMiniProps,
  ButtonSecondaryProps,
  ButtonSecondaryLgProps,
  ButtonSecondaryMiniProps,
  ButtonCancelProps,
  ButtonCancelLgProps,
  ButtonCancelMiniProps,
  ButtonAddPrimaryProps,
  ButtonAddSecondaryProps,
  ButtonAddTertiaryProps,
  ButtonSupportProps,
  ButtonAvatarProps,
  ButtonBackProps,
  ButtonEditProps,
  ButtonActivateProps,
  AllSelectionButtonPairProps,
} from './components/buttons';

// ─── Icons ─────────────────────────────────────────────────────────────────
export type { IconProps } from './components/icons';
export { EyeIcon } from './components/icons/EyeIcon';
export { EyeOffIcon } from './components/icons/EyeOffIcon';
export { QuestionIcon } from './components/icons/QuestionIcon';
export { AvatarIcon } from './components/icons/AvatarIcon';
export { SearchIcon } from './components/icons/SearchIcon';
export { PlusIcon } from './components/icons/PlusIcon';
export { PencilIcon } from './components/icons/PencilIcon';
export { ArrowLeftIcon } from './components/icons/ArrowLeftIcon';
export { ActivatedIcon } from './components/icons/ActivatedIcon';
export { DeactivatedIcon } from './components/icons/DeactivatedIcon';
export { MinusRedIcon } from './components/icons/MinusRedIcon';
export { PlusGreenIcon } from './components/icons/PlusGreenIcon';
export { CheckIcon } from './components/icons/CheckIcon';
export { CalendarIcon } from './components/icons/CalendarIcon';
export { ArrowDownIcon } from './components/icons/ArrowDownIcon';
export { CloseIcon, type CloseIconProps } from './components/icons/CloseIcon';
export { ClockXIcon, ClockAlertIcon } from './components/icons/AlertasIcons';
export {
  HomeIcon,
  UsersIcon,
  SidebarClockIcon,
  UserPlusIcon,
  ChartIcon,
  CubeIcon,
  LogoutIcon,
} from './components/icons/SidebarIcons';
