/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="deno.ns" />
/// <reference lib="esnext" />

import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.32-alpha/deno-dom-wasm.ts';
import { describe, it } from 'https://deno.land/std@0.148.0/testing/bdd.ts';
import { assertExists } from 'jsr:@std/assert';
import { App, FreshConfig, staticFiles } from 'fresh';
import { withBrowserApp } from './test_utils.tsx';
import ThemeToggle from '../src/islands/ThemeToggle.tsx';

function testApp(config?: FreshConfig) {
  const app = new App(config);
  return app;
}

describe('ThemeToggle component', () => {
  it('should exists.', () => {
    const compAsString = <ThemeToggle />;
    const doc = new DOMParser().parseFromString(
      compAsString.toString(),
      'text/html',
    );

    assertExists(doc);
  });

  it('should have a button.', async () => {
    const app = testApp()
      .use(staticFiles())
      .get('/', (ctx) => {
        return ctx.render(
          <nav>
            <ThemeToggle />,
          </nav>,
        );
      });

    await withBrowserApp(app, async (page, address) => {
      await page.goto(address, { waitUntil: 'load' });
      await page.locator('button.theme-toggle').wait();
      // await waitForText(page, '.theme-toggle.button .output', '1');
    });
  });
});
