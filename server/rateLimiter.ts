export function createFixedWindowRateLimiter(limit: number, windowMs: number) {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs < 1) {
    throw new RangeError("Rate-limit limit and window must be positive.");
  }

  let windowStartedAt: number | undefined;
  let requestCount = 0;

  return (now = Date.now()): boolean => {
    if (
      windowStartedAt === undefined ||
      now < windowStartedAt ||
      now - windowStartedAt >= windowMs
    ) {
      windowStartedAt = now;
      requestCount = 0;
    }

    if (requestCount >= limit) return false;
    requestCount += 1;
    return true;
  };
}
