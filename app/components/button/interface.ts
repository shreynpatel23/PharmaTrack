export interface IButtonProps {
  buttonText: string;
  buttonClassName: string;
  onClick: () => void;
  hasIcon?: boolean;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
}
