import { afterEach, describe, expect, it, vi } from "vitest";
import { assistantRouter } from "./assistant";
import { invokeLLM } from "./_core/llm";
import type { TrpcContext } from "./_core/context";
import { createFixedWindowRateLimiter } from "./rateLimiter";

vi.mock("./_core/llm", () => ({ invokeLLM: vi.fn() }));

const context = {
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
  user: null,
} satisfies TrpcContext;

function mockAssistantResponse(content: string) {
  vi.mocked(invokeLLM).mockResolvedValueOnce({
    id: "mock-response",
    created: 0,
    model: "mock",
    choices: [
      {
        index: 0,
        message: { role: "assistant", content },
        finish_reason: "stop",
      },
    ],
  });
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("visitor assistant", () => {
  it("answers from the current site context and includes bounded conversation history", async () => {
    mockAssistantResponse("تبدأ الجمعة 20 نوفمبر 2026.");
    const history = [{ role: "user" as const, content: "ما اسم الورشة؟" }];

    const result = await assistantRouter.createCaller(context).answer({
      message: "متى تبدأ؟",
      history,
    });

    expect(result.answer).toBe("تبدأ الجمعة 20 نوفمبر 2026.");
    const request = vi.mocked(invokeLLM).mock.calls[0]?.[0];
    expect(request?.messages[0]).toMatchObject({ role: "system" });
    expect(String(request?.messages[0]?.content)).toContain("20 نوفمبر 2026");
    expect(request?.messages.at(-2)).toEqual(history[0]);
    expect(request?.messages.at(-1)).toMatchObject({ role: "user", content: "متى تبدأ؟" });
    expect(request?.maxTokens).toBe(400);
  });

  it("rejects oversized questions and histories before contacting the LLM", async () => {
    const caller = assistantRouter.createCaller(context);

    await expect(caller.answer({ message: "س".repeat(1201), history: [] })).rejects.toThrow();
    await expect(
      caller.answer({
        message: "سؤال",
        history: Array.from({ length: 9 }, () => ({ role: "user" as const, content: "سؤال سابق" })),
      }),
    ).rejects.toThrow();
    expect(invokeLLM).not.toHaveBeenCalled();
  });

  it("returns a generic error without logging the provider's response body", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("private provider details"));

    await expect(
      assistantRouter.createCaller(context).answer({ message: "سؤال", history: [] }),
    ).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "تعذّر إعداد إجابة الآن. حاول مرة أخرى بعد قليل.",
    });
    expect(console.error).toHaveBeenCalledWith("Visitor assistant request failed.");
  });
});

describe("fixed-window rate limiter", () => {
  it("caps requests and opens a new window without keeping visitor identifiers", () => {
    const limit = createFixedWindowRateLimiter(2, 1000);
    const start = 1_000_000;

    expect(limit(start)).toBe(true);
    expect(limit(start + 999)).toBe(true);
    expect(limit(start + 999)).toBe(false);
    expect(limit(start + 1000)).toBe(true);
  });
});
