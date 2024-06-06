export interface IButtonProps {
  buttonText: string;
  buttonClassName: string;
  hasIcon: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
}
