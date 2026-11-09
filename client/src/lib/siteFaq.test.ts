import { describe, expect, it } from "vitest";
import { answerSiteQuestion } from "./siteFaq";

describe("answerSiteQuestion", () => {
  it("answers the workshop start-date question", () => {
    expect(answerSiteQuestion("متى تبدأ الورشة؟")).toContain("20 نوفمبر 2026");
  });

  it("answers the suggested audience question", () => {
    expect(answerSiteQuestion("لمن تناسب الورشة؟")).toContain("صنّاع المحتوى");
  });

  it("does not invent a workshop price", () => {
    expect(answerSiteQuestion("كم سعر الورشة؟")).toContain("لا توضح تفاصيل رسوم الورشة");
  });

  it("directs unknown questions to the workshop team", () => {
    expect(answerSiteQuestion("هل يوجد موقف سيارات؟")).toContain("لم أجد إجابة");
  });
});
