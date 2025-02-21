import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface UseRetryResult<T> {
  execute: () => Promise<T>;
  isLoading: boolean;
  error: Error | null;
  attempts: number;
  reset: () => void;
}

export function useRetry<T>(
  operation: () => Promise<T>,
  {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  }: UseRetryOptions = {}
): UseRetryResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempts, setAttempts] = useState(0);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAttempts(0);
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const execute = useCallback(async (): Promise<T> => {
    setIsLoading(true);
    setError(null);

    let currentDelay = initialDelay;
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        const result = await operation();
        setIsLoading(false);
        setAttempts(attempt + 1);
        return result;
      } catch (err) {
        attempt++;
        setAttempts(attempt);

        if (attempt === maxAttempts) {
          const error = err instanceof Error ? err : new Error('Operation failed');
          setError(error);
          setIsLoading(false);
          throw error;
        }

        await sleep(currentDelay);
        currentDelay = Math.min(currentDelay * backoffFactor, maxDelay);
      }
    }

    // This should never be reached due to the throw in the catch block
    throw new Error('Maximum retry attempts exceeded');
  }, [operation, maxAttempts, initialDelay, maxDelay, backoffFactor]);

  return {
    execute,
    isLoading,
    error,
    attempts,
    reset,
  };
} 