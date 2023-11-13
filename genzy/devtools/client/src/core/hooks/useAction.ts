import { useMutation } from "react-query";
import type { AxiosError, AxiosPromise, AxiosResponse } from "axios";

const useAction = <TIn = any, TOut = any, TError = any>(
  callableF: (arg0: TIn) => AxiosPromise<AxiosResponse<any, any>>,
  options: { onSuccess: (arg0: TOut) => void; onError: (arg0: TError) => void }
): ((arg0: TIn) => any) => {
  return useMutation((arg0: TIn) => callableF(arg0), {
    onSuccess: (response: AxiosResponse) => {
      options.onSuccess(response?.data as TOut);
    },
    onError: (erorr: AxiosError) => {
      options.onError(erorr?.response?.data as TError);
    },
  }).mutate;
};

export { useAction };
