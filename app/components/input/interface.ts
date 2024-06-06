export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasLabel: boolean;
  label: string;
  hasError?: boolean;
  error?: string;
  hasHelperText?: boolean;
  helperText?: string;
}
