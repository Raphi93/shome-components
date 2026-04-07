import { useSearchParams, useRouter } from "next/navigation";


export function useQueryParameter(
  parameterName: string,
  defaultValue?: string
): [string | undefined, (newValue: string | undefined) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setParameter = (newValue: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === defaultValue) {
      params.delete(parameterName);
    } else {
      params.set(parameterName, newValue ?? '');
    }
    router.push(`?${params.toString()}`);
  };

  const parameterValue = searchParams.get(parameterName) ?? undefined;

  return [parameterValue, setParameter];
}
