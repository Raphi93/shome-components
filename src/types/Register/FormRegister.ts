export type UseFormRegister = (
  name: string,
  options?: {
    required?: boolean;
    valueAsNumber?: true | undefined;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
  }
) => Record<string, any>;
