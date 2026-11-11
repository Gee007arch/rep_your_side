import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.resolve(__dirname, '../src/styles');
const baselineCssPath = path.resolve(__dirname, '../../source/dist/styles.css');

describe('Tailwind Step T3 Migration Verification', () => {
  it('verifies legacy.css has been deleted and main.css has no legacy import', () => {
    const legacyPath = path.join(stylesDir, 'legacy.css');
    expect(fs.existsSync(legacyPath)).toBe(false);

    const mainCss = fs.readFileSync(path.join(stylesDir, 'main.css'), 'utf8');
    expect(mainCss).not.toContain('legacy.css');
    expect(mainCss).not.toContain('@import "tailwindcss" utilities;');
    expect(mainCss).toContain('@import "tailwindcss/theme.css" layer(theme);');
    expect(mainCss).toContain('@import "tailwindcss/utilities.css" layer(utilities);');
    expect(mainCss).toContain('@theme');
    expect(mainCss).toContain('@layer base');
    expect(mainCss).toContain('@layer components');
    expect(mainCss).toContain('@apply');
  });

  it('verifies 100% of class selectors from baseline source/dist/styles.css are preserved in main.css', () => {
    const baselineCss = fs.readFileSync(baselineCssPath, 'utf8');
    const mainCss = fs.readFileSync(path.join(stylesDir, 'main.css'), 'utf8');

    // Extract all class names (e.g., .hero-art, .mission-card, .place-copy) from baseline styles.css
    const classMatches = baselineCss.match(/\.[a-zA-Z][a-zA-Z0-9_-]*/g) || [];
    const uniqueClasses = Array.from(new Set(classMatches));

    expect(uniqueClasses.length).toBeGreaterThan(100);

    for (const cls of uniqueClasses) {
      expect(mainCss, `Missing class selector ${cls} in main.css`).toContain(cls);
    }
  });

  it('verifies all 5 responsive media query breakpoints and prefers-reduced-motion are defined in main.css', () => {
    const mainCss = fs.readFileSync(path.join(stylesDir, 'main.css'), 'utf8');
    expect(mainCss).toContain('@media (min-width: 1500px)');
    expect(mainCss).toContain('@media (max-width: 1180px)');
    expect(mainCss).toContain('@media (max-width: 980px)');
    expect(mainCss).toContain('@media (max-width: 720px)');
    expect(mainCss).toContain('@media (max-width: 480px)');
    expect(mainCss).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('verifies root CSS variables, line-height:0 on SVG art containers, and valid compiled CSS output', () => {
    const mainCss = fs.readFileSync(path.join(stylesDir, 'main.css'), 'utf8');
    expect(mainCss).toContain("--font: 'DM Sans', Arial, sans-serif;");
    expect(mainCss).toContain("--head: 'Outfit', Arial, sans-serif;");
    expect(mainCss).toContain('leading-[0]');

    const distAssetsDir = path.resolve(__dirname, '../dist/assets');
    if (fs.existsSync(distAssetsDir)) {
      const cssFile = fs.readdirSync(distAssetsDir).find((f) => f.endsWith('.css'));
      if (cssFile) {
        const compiled = fs.readFileSync(path.join(distAssetsDir, cssFile), 'utf8');
        expect(compiled).not.toContain('@media utilities');
        expect(compiled).toContain('--color-deep:#183e35');
        expect(compiled).toContain('--color-orange:#ed7547');
        expect(compiled).toContain('--font:"DM Sans", Arial, sans-serif');
        expect(compiled).toContain('--head:"Outfit", Arial, sans-serif');
      }
    }
  });
});
