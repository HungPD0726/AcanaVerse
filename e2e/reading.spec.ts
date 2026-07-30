import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function startReading(page: Page, path: string, shuffleLabel: string) {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(path);
  await page.getByRole("button", { name: shuffleLabel }).click();
  await page.waitForTimeout(1_500);
  expect(pageErrors).toEqual([]);
  await expect(page.getByTestId("card-fan")).toBeVisible({ timeout: 5_000 });
}

async function selectCards(page: Page, count: number) {
  const fan = page.getByTestId("card-fan");
  const cards = fan.getByRole("button");
  for (let index = 0; index < count; index += 1) {
    await cards.nth(index).click();
  }
}

async function revealCards(
  page: Page,
  beginLabel: string,
  revealLabel: string,
  count: number,
) {
  await page.getByRole("button", { name: beginLabel }).click();
  for (let index = 0; index < count; index += 1) {
    await page
      .getByRole("button", { name: revealLabel, exact: true })
      .click();
  }
}

test("Vietnamese daily reading, restore, theme and accessibility", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vi/reading/daily-insight");
  await page
    .getByLabel("Câu hỏi của bạn")
    .fill("Điều gì cần được nhìn rõ hôm nay?");
  await page.getByRole("button", { name: "Xáo bài" }).click();
  await expect(page.getByTestId("card-fan")).toBeVisible();
  await page.getByTestId("card-fan").getByRole("button").first().click();
  await revealCards(page, "Bắt đầu lật bài", "Lật lá tiếp theo", 1);
  const revealedName = await page
    .getByTestId("spread-card-1")
    .getAttribute("aria-label");
  await expect(page.getByTestId("interpretation-panel")).toBeVisible();

  await page.reload();
  await expect(
    page.getByText("Phiên trải bài trước đã được khôi phục."),
  ).toBeVisible();
  await expect(page.getByTestId("spread-card-1")).toHaveAttribute(
    "aria-label",
    revealedName ?? "",
  );

  const themeButton = page.getByRole("button", {
    name: "Dùng giao diện tối",
  });
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(
    accessibility.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

test("English three card reading", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await startReading(
    page,
    "/en/reading/past-present-future",
    "Shuffle the deck",
  );
  await selectCards(page, 3);
  await revealCards(page, "Begin revealing", "Reveal next card", 3);
  await expect(page.getByText("Full reading")).toBeVisible();
  await expect(page.getByTestId("interpretation-panel")).toBeVisible();
  await expect(page.getByTestId("spread-card-3")).toHaveAttribute(
    "aria-label",
    /Future/,
  );
});

test("Celtic Cross desktop has ten sequential cards", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await startReading(page, "/en/reading/celtic-cross", "Shuffle the deck");
  await selectCards(page, 10);
  await revealCards(page, "Begin revealing", "Reveal next card", 10);
  await expect(page.getByText("Full reading")).toBeVisible();
  await expect(page.getByTestId("spread-card-10")).toHaveAttribute(
    "aria-label",
    /Outcome/,
  );
});

test("Celtic Cross mobile exposes the scroll canvas and ordered list", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await startReading(page, "/vi/reading/celtic-cross", "Xáo bài");
  await selectCards(page, 10);
  await page.getByRole("button", { name: "Bắt đầu lật bài" }).click();
  await expect(
    page.getByText("Vuốt ngang để xem toàn bộ bố cục Celtic Cross."),
  ).toBeVisible();
  await expect(page.getByText("Các vị trí đã chọn")).toBeVisible();
  await expect(page.getByText("Kết quả", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Lật lá tiếp theo", exact: true })
    .click();
  await expect(page.getByTestId("interpretation-panel")).toBeVisible();
});

test("keyboard can start and choose a card", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await page.goto("/en/reading/daily-insight");
  await page.getByLabel("Your question").focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("card-fan")).toBeVisible();
  const firstCard = page.getByTestId("card-fan").getByRole("button").first();
  await firstCard.focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("The cards are in place")).toBeVisible();
});
