import { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import { extractErrorMessage } from "../utils/errorUtils";

interface UseAuthFormReturn {
  email: string;
  error: string | null;
  loading: boolean;
  navigate: NavigateFunction;
  password: string;
  executeAuth: (action: () => Promise<void>) => Promise<void>;
  setEmail: (value: string) => void;
  setError: (value: string | null) => void;
  setPassword: (value: string) => void;
}

export function useAuthForm(): UseAuthFormReturn {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();

  const executeAuth: (action: () => Promise<void>) => Promise<void> = useCallback(
    async (action: () => Promise<void>): Promise<void> => {
      setError(null);
      setLoading(true);

      try {
        await action();
      } catch (err: unknown) {
        const msg: string = extractErrorMessage(err, "Error de autenticación");
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { email, error, loading, password, navigate, executeAuth, setEmail, setError, setPassword };
}
