import { test, expect } from '@playwright/test';
test('ProgrammaticDeclarativeOutOfSequence', async ({ page }) => {
    await page.goto('./tests/ProgrammaticDeclarativeOutOfSequence.html');
    const target = page.locator('#target');
    await expect(target).toHaveAttribute('ready', '');
    await page.locator('#subject').setInputFiles({
        name: 'hello.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
    });
    await expect(target).toHaveAttribute('mark', 'good');
});
