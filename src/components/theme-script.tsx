export function ThemeScript() {
  const code = `
    (() => {
      try {
        const stored = localStorage.getItem("arcana-theme");
        const theme = stored === "light" || stored === "dark"
          ? stored
          : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
      } catch {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
