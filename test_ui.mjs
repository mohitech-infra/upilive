import puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 }); // iPhone 12 Pro size

    // Wait for the dev server to be ready
    await new Promise(r => setTimeout(r, 2000));

    await page.goto('http://localhost:5173/dashboard');

    // Wait a bit for rendering
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: 'frontend_verification_Dashboard.webp', type: 'webp' });

    await page.goto('http://localhost:5173/templates');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'frontend_verification_Templates.webp', type: 'webp' });

    await page.goto('http://localhost:5173/pricing');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'frontend_verification_Pricing.webp', type: 'webp' });

    await page.goto('http://localhost:5173/refer');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'frontend_verification_ReferEarn.webp', type: 'webp' });

    await browser.close();
    console.log("Screenshots captured successfully.");
})();
