import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER [${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:5173/');
  
  // Wait a couple seconds to catch any delayed errors
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({path: 'puppeteer-screenshot.png'});
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  console.log('ROOT HTML:', rootHtml.substring(0, 500));
  
  await browser.close();
})();
