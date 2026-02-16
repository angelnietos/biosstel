import { IconProps } from "@/interfaces/icons";

export const EyeIcon = ({ size = "24", cssProps = "text-gray-350" }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cssProps}
    >
      <path
        d="M12 5C7.45 5 3.57 7.77 2 12c1.57 4.23 5.45 7 10 7s8.43-2.77 10-7c-1.57-4.23-5.45-7-10-7Zm0 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm0-6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
};
