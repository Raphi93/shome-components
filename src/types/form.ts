/**
 * Minimal subset of `react-hook-form`'s `UseFormRegister` used by input
 * components. Keeps the library independent of a specific RHF version.
 */
export type UseFormRegister = (
  name: string,
  options?: {
    required?: boolean;
    valueAsNumber?: true | undefined;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
  }
) => Record<string, any>;
