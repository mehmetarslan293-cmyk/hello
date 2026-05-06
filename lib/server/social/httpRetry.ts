type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryStatus(status: number) {
  return status === 429 || status >= 500;
}

export async function fetchWithRetry(input: URL | string, init?: RequestInit, options?: RetryOptions) {
  const retries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 400;
  let lastResponse: Response | null = null;
  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(input, init);
      if (!shouldRetryStatus(res.status) || attempt === retries) {
        return res;
      }
      lastResponse = res;
    } catch (error) {
      lastError = error;
      if (attempt === retries) throw error;
    }
    const jitter = Math.floor(Math.random() * 120);
    await wait(baseDelayMs * 2 ** attempt + jitter);
  }
  if (lastResponse) return lastResponse;
  throw lastError instanceof Error ? lastError : new Error("HTTP request failed");
}
