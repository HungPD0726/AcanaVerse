import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it } from "vitest";
import enMessages from "../../messages/en.json";
import { DemoLoginForm } from "@/components/demo-login-form";
import {
  AuthProvider,
  DEMO_USER_STORAGE_KEY,
} from "@/components/providers/auth-provider";

function renderForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <AuthProvider>
        <DemoLoginForm />
      </AuthProvider>
    </NextIntlClientProvider>,
  );
}

describe("demo login", () => {
  beforeEach(() => localStorage.clear());

  it("validates email and the 12 character password minimum", () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Demo sign in" }));
    expect(screen.getByText("Enter a valid email address.")).toBeVisible();
    expect(
      screen.getByText("Password must contain at least 12 characters."),
    ).toBeVisible();
  });

  it("stores only the demo user and discards the password", () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "reader@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "private-value-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Demo sign in" }));
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    expect(stored).toContain("reader@example.com");
    expect(stored).not.toContain("private-value-123");
    expect(stored).not.toContain("password");
    expect(screen.getByText(/Signed in as reader@example.com/)).toBeVisible();
  });
});
