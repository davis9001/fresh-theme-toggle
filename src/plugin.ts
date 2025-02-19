import { App } from 'jsr:@fresh/core@^2.0.0-alpha.29';
import ThemeToggle from './islands/ThemeToggle.tsx';

/**
 * The head script string to put in the <Head> element.
 * Important for avoiding FOUC (Flash Of Unstyled Content).`
 *
 * @example
 * # _app.tsx
 * import { PageProps } from "fresh";
 * + import { themeToggleHeadScript } from "@davis9001/fresh-theme-toggle";
 * ...
 *      <head>
 *        ...
 * +      <script src={`data: text/javascript, ${themeToggleHeadScript}`}></script>
 *      </head>
 */
export const themeToggleHeadScript: string =
  `const isDarkMode = localStorage.theme === "dark"
|| (!("theme" in localStorage)
  && window.matchMedia("(prefers-color-scheme: dark)").matches);
document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
`.replace(/(\n|\t)/g, '').replace(/"/g, "'");

/**
 * Bundles the ThemeToggle island in the Fresh app instance.
 */
export function freshThemeToggle<T>(
  app: App<T>,
) {
  app.island('./islands/ThemeToggle.tsx', 'ThemeToggle', ThemeToggle);
}
