import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import enMessages from "../../../messages/en.json";
import { ReadingExperience } from "@/components/reading/reading-experience";
import { getSpread } from "@/data/spreads";
import { createReadingSession } from "@/lib/reading-engine";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href}>{children}</a>
  ),
}));

const spread = getSpread("daily-insight")!;

describe("reading experience", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => vi.useRealTimers());

  it("accepts an optional question, shows the fan and reveals in order", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <ReadingExperience
          spread={spread}
          initialSession={createReadingSession(spread, "en")}
        />
      </NextIntlClientProvider>,
    );

    const questionInput = screen.getByPlaceholderText(
      "Type your question or scenario...",
    );
    fireEvent.change(questionInput, {
      target: { value: "What should I notice today?" },
    });
    expect(questionInput).toHaveValue("What should I notice today?");

    const proceedButton = screen.getByRole("button", { name: /proceed/i });
    fireEvent.click(proceedButton);

    await act(async () => vi.runAllTicks());
    const shuffleButton = screen.getByRole("button", {
      name: /shuffle/i,
    });
    expect(shuffleButton).toBeEnabled();
    fireEvent.click(shuffleButton);

    await act(async () => vi.advanceTimersByTimeAsync(2_000));
    const doneButton = screen.getByRole("button", {
      name: /done/i,
    });
    fireEvent.click(doneButton);
    await act(async () => vi.advanceTimersByTimeAsync(350));

    const fan = screen.getByTestId("card-fan");
    const faceDownCards = fan.querySelectorAll("button");
    expect(faceDownCards).toHaveLength(78);
    fireEvent.click(faceDownCards[0]);
    await act(async () => vi.advanceTimersByTimeAsync(350));

    expect(screen.getByText("The cards are in place")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Begin revealing" }));
    await act(async () => vi.advanceTimersByTimeAsync(350));
    fireEvent.click(screen.getByTestId("spread-card-1"));
    await act(async () => vi.advanceTimersByTimeAsync(350));
    expect(screen.getByTestId("interpretation-panel")).toBeInTheDocument();
  });
});
