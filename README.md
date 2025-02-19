# Fresh `<ThemeToggle />`

> [!NOTE]\
> Not yet suitable for public use!

> [!NOTE]\
> This Fresh plugin is only tested on 2.0.0-alpha.29

A Deno [Fresh 🍋](https://fresh.deno.dev/) light/dark theme toggle button as an
Island: `<ThemeToggle />`.

The island provides all of the theme toggle functionality, including:

- A light/dark theme toggle button.
- A `className` prop for customizing the appearance of the button.
- Checks and uses system theme preference using the `window.matchMedia` API.
- Storage of the user's theme preference in local storage (if they use the
  toggle).

**To avoid FOUC (Flash Of Unstyled Content) you'll need to update your Head
element in one way or another.**

## Installation

Install using Deno (run this From your Fresh project folder):

```sh
deno add jsr:@davis9001/fresh-theme-toggle
```

Import and initialize in your `main.ts`:

```diff
import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
+ import freshThemeToggle from '@davis9001/fresh-theme-toggle';

await start(manifest, {
  plugins: [
+    freshThemeToggle
    ],
});
```

## Usage

Add the island to one of your routes or components (your `Header.tsx` for
example):

```diff
+ import { ThemeToggle } from '@davis9001/fresh-theme-toggle/islands';
...
default export function Header() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
+       <ThemeToggle />
      </nav>
    </>
  );
}
```

Add the optional (but highly recommended) modifications to your `<head>` (for
example in `_app.tsx`):

### Color Scheme Meta Tag:

```diff
return (
  <html lang='en'>
    <head>
      <meta charset='UTF-8' />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ...
+      <meta name='color-scheme' content='light dark' />
      ...
+      <script
+        type='module'
+        dangerouslySetInnerHTML={{
+          __html: `
+const isDarkMode = localStorage.theme === "dark"
+|| (!("theme" in localStorage)
+  && window.matchMedia("(prefers-color-scheme: dark)").matches);
+document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";`,
+        }}
+      >
+      </script>
    </head>
    <body>
      <Header />
      <Component />
    </body>
  </html>
);
```

### What `<ThemeToggle />` Does

Fresh ThemeToggle uses the `data-theme` attribute on the `<html>` element to
both store and determine the current color scheme of the page. If the
`data-theme` attribute is set to "dark" then the page is currently in "dark
mode". If it is set to "light" then the page is currently in "light mode". This
allows us to dynamically change the color scheme of the page based on user
preferences.

When a user clicks the toggle, it will do the following:

- Determine the currently displayed theme (by checking the `data-theme`
  attribute).
- Update the `data-theme` attribute to "dark" or "light" (the opposite).
- Save the theme preference to localStorage in `localStorage.theme`.

The localStorage.theme variable is not modified until the user clicks on the
toggle button. If they have not clicked it then the `prefers-color-scheme` value
is used on every page load.

### What the Added Header Changes Do

There are two elements in your page's Head file that assist in this process:

- The `<meta>` tag: This meta tag sets the `color-scheme` used to specify the
  preferred color scheme for a web page. It informs browsers about the user's
  system preferences and allows helps the browser apply the appropriate theme as
  early as possible.
- The `<script>` tag: This adds the `data-theme` attribute to the `<html>`
  element as early as is possible as the page loads. This ensures that the color
  scheme of the page is set up very early in the page rendering process on the
  client side regardless of the current theme state.

### Using with TailWind

This plugin assumes that you will be using a standard Tailwind CSS and Fresh
installation.

The recommended way to set up your site for support for dark/light mode is as
follows:

In your `styles.css` file set up CSS vars for your site's standard colors (for
both light and dark):

```diff
@tailwind base;
@tailwind components;
@tailwind utilities;

+ /* Light and dark theme variables */
+ :root {
+   --background-primary: 215deg, 100%, 100%;
+   --background-secondary: 210deg, 29%, 97%;
+   --background-tertiary: 207deg, 33%, 95%;
+   --foreground-primary: 213deg, 9%, 25%;
+   --foreground-secondary: 0deg, 0%, 23%;
+   --foreground-tertiary: 0deg, 0%, 27%;
+   --foreground-quaternary: 0deg, 0%, 30%;
+ }
+ html[data-theme='dark']:root {
+   --background-primary: 216deg, 27.8%, 7.1%;
+   --background-secondary: 216deg, 27.7%, 12%;
+   --background-tertiary: 216deg, 27.7%, 22%;
+   --foreground-primary: 215deg, 17%, 99%;
+   --foreground-secondary: 215deg, 17%, 71%;
+   --foreground-tertiary: 215deg, 17%, 67%;
+   --foreground-quaternary: 215deg, 17%, 66%;
+ }
```

Then extend your Tailwind theme with these variables:

```diff
  theme: {
    extend: {
      colors: {
+        "background-primary": "hsla(var(--background-primary))",
+        "background-secondary": "hsla(var(--background-secondary))",
+        "background-tertiary": "hsla(var(--background-tertiary))",
+        "foreground-primary": "hsla(var(--foreground-primary))",
+        "foreground-secondary": "hsla(var(--foreground-secondary))",
+        "foreground-tertiary": "hsla(var(--foreground-tertiary))",
      }
    }
  }
  ...
```

Now you can use these colors in your JSX components etc. like this:

```jsx
<a href='/' class='bg-background-primary text-foreground-primary'>Home</a>;
```

You can use these colors in your CSS with `color()` or `@apply`:

```css
a.test {
  @apply text-foreground-secondary;
  background-color: color('theme.foreground-primary');
}

/* With opacity: */
div.test {
  @apply text-foreground-primary/80;
  background-color: color('theme.foreground-primary/20%');
}
```

## Design Pattern Decisions (Nerdy Stuff)

It appears that most websites using a similar one icon toggle button use the
following pattern:

- Show moon icon while in dark mode
- Show sun icon while in light mode

Fresh ThemeToggle uses the opposite approach: The idea is that the icon (when
alone on a button) should not serve as a status indicator but rather as a clear
hint of what will happen if the button is pressed.

## License

MIT © [David Monaghan](https://github.com/davis9001)
