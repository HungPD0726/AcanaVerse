import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import enMessages from "../../../messages/en.json";
import { DemoLoginForm } from "@/components/auth/demo-login-form";
import { AppProviders } from "@/components/providers/app-providers";

describe("demo login form", () => {
  it("validates form fields and simulates sign in", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <AppProviders>
          <DemoLoginForm />
        </AppProviders>
      </NextIntlClientProvider>,
    );

    const submit = screen.getByRole("button", { name: "Demo sign in" });
    fireEvent.click(submit);

    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must contain at least 12 characters."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "seeker@arcanaverse.app" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "mystic-tarot-2026-key" },
    });
    fireEvent.click(submit);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You are signed in in demo mode.",
    );
  });
});
