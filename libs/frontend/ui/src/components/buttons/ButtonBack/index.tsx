import { IconButton } from '../../IconButton';
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon';

export interface ButtonBackProps {
  href: string;
  onClick?: () => void;
  /** For use outside Next: render as anchor and use onClick for SPA navigation */
  asAnchor?: boolean;
  children?: React.ReactNode;
  cssProps?: string;
}

export const ButtonBack = ({
  href,
  asAnchor = true,
  children,
  cssProps = '',
}: ButtonBackProps) => {
  const content = (
    <IconButton className={`size-7 bg-gray-100 shadow-sm flex items-center justify-center p-0 ${cssProps}`}>
      <ArrowLeftIcon className="w-4 h-4" />
      {children ?? null}
    </IconButton>
  );

  if (asAnchor) {
    return (
      <a href={href} className="inline-block" tabIndex={-1}>
        {content}
      </a>
    );
  }

  return content;
};
