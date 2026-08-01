import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function startReading(
  page: Page,
  path: string,
  labels: {
    skipQuestion: string;
    shuffle: string;
    beginSelecting: string;
  },
) {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(path);
  await page.getByRole("button", { name: labels.skipQuestion }).click();
  await page.getByRole("button", { name: labels.shuffle, exact: true }).click();
  await page
    .getByRole("button", { name: labels.beginSelecting, exact: true })
    .click();
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
  await page.getByRole("button", { name: "Tiếp tục" }).click();
  await page.getByRole("button", { name: "Xáo bài", exact: true }).click();
  await page
    .getByRole("button", { name: "Trải bài và chọn lá", exact: true })
    .click();
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
    {
      skipQuestion: "Continue without a question",
      shuffle: "Shuffle the deck",
      beginSelecting: "Spread the deck and choose",
    },
  );
  await selectCards(page, 3);
  await revealCards(page, "Begin revealing", "Reveal next card", 3);
  await expect(page.getByText("The reading is complete")).toBeVisible();
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
  await startReading(page, "/en/reading/celtic-cross", {
    skipQuestion: "Continue without a question",
    shuffle: "Shuffle the deck",
    beginSelecting: "Spread the deck and choose",
  });
  await selectCards(page, 10);
  await revealCards(page, "Begin revealing", "Reveal next card", 10);
  await expect(page.getByText("The reading is complete")).toBeVisible();
  await expect(page.getByTestId("spread-card-10")).toHaveAttribute(
    "aria-label",
    /Outcome/,
  );
});

test("Celtic Cross mobile exposes the scroll canvas and ordered list", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await startReading(page, "/vi/reading/celtic-cross", {
    skipQuestion: "Không nhập câu hỏi",
    shuffle: "Xáo bài",
    beginSelecting: "Trải bài và chọn lá",
  });
  await selectCards(page, 10);
  await page.getByRole("button", { name: "Bắt đầu lật bài" }).click();
  await expect(
    page.getByText("Vuốt ngang để xem toàn bộ bố cục Celtic Cross."),
  ).toBeVisible();
  await expect(page.getByText("Các vị trí trong trải bài")).toBeVisible();
  await expect(page.getByText("Kết quả", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Lật lá tiếp theo", exact: true })
    .click();
  await expect(page.getByTestId("interpretation-panel")).toBeVisible();
});

test("keyboard can start and choose a card", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile");
  await page.goto("/en/reading/daily-insight");
  const skipQuestion = page.getByRole("button", {
    name: "Continue without a question",
  });
  await skipQuestion.focus();
  await page.keyboard.press("Enter");
  const shuffle = page.getByRole("button", {
    name: "Shuffle the deck",
    exact: true,
  });
  await shuffle.focus();
  await page.keyboard.press("Enter");
  const beginSelecting = page.getByRole("button", {
    name: "Spread the deck and choose",
    exact: true,
  });
  await expect(beginSelecting).toBeEnabled();
  await beginSelecting.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("card-fan")).toBeVisible();
  const firstCard = page.getByTestId("card-fan").getByRole("button").first();
  await firstCard.focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("The cards are in place")).toBeVisible();
});
