import { toast, type Id } from "react-toastify";

export async function withToast<T>(
  fn: () => Promise<T>,
  loadingMsg: string,
  successMsg: string,
  errorMsg: string,
): Promise<T | undefined> {
  const toastId: Id = toast.loading(loadingMsg);
  try {
    const result: T = await fn();
    toast.update(toastId, { autoClose: 3000, isLoading: false, render: successMsg, type: "success" });
    return result;
  } catch {
    toast.update(toastId, { autoClose: 3000, isLoading: false, render: errorMsg, type: "error" });
    return undefined;
  }
}

export async function withDelay<T>(promise: Promise<T>, ms: number = 800): Promise<T> {
  const [result] = await Promise.all([promise, new Promise<void>((resolve) => { setTimeout(resolve, ms); })]);
  return result;
}
