/* Run: npm install; npx playwright install chromium; npm test
 * All mail requests are intercepted; this suite never sends an order. */
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
 const server = spawn('python3', ['-m','http.server','8765','--directory',path.resolve(__dirname,'..')]);
 let browser;
 try {
  await new Promise(r=>setTimeout(r,500));
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox','--disable-gpu']});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
  await context.route(/https:\/\//,r=>r.abort());
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/catalog.html');
  await page.locator('[data-analytics="deny"]').click();
  assert.equal(await page.locator('#grid .card').count(),13);
  await page.locator('#catalogSearch').fill('кристальная');
  assert.equal(await page.locator('#grid .card').count(),1);
  await page.locator('#grid [data-cart="plus"]').click();
  await page.locator('#grid [data-cart="plus"]').click();
  assert.equal(await page.locator('#cartTotal').textContent(),'420 ₽');
  await page.locator('#catalogSearch').fill('несуществующий');
  assert.equal(await page.locator('.catalog-empty').count(),1);
  await page.locator('#resetSearch').click();
  await page.locator('#catalogSort').selectOption('price-asc');
  assert.match(await page.locator('#grid .card').first().textContent(),/Природный источник/);
  await page.locator('#cartFab').click();
  assert.equal(await page.locator('#cartNext').isEnabled(),true);
  await page.locator('#cartTown').selectOption('dinskaya');
  assert.equal(await page.locator('#cartTotal').textContent(),'520 ₽');
  assert.equal(await page.locator('#cartNext').isDisabled(),true);
  await page.locator('#cartProducts [data-cart="plus"]').click();
  assert.equal(await page.locator('#cartTotal').textContent(),'780 ₽');
  assert.equal(await page.locator('#cartNext').isEnabled(),true);
  await page.locator('#cartNext').click();
  await page.locator('#personalConsent').check();
  assert.equal(await page.locator('#privacyConsent').isChecked(),false);
  await page.locator('#privacyConsent').check(); await page.locator('#offerConsent').check();
  await page.locator('#orderAddress').fill('Тестовый адрес');
  await page.locator('#orderPhone').fill('89991234567');
  await page.locator('#orderPayment').selectOption('Наличными при получении');
  await page.locator('#orderDate').fill('2000-01-01');
  let calls=0;
  await page.route('**/send-order.php',r=>{calls++;return r.fulfill({status:200,body:'Static host HTML'});});
  await page.locator('#emailOrder').click(); assert.equal(calls,0);
  await page.locator('#orderDate').fill('2099-01-01');
  await page.locator('#emailOrder').click();
  await page.waitForFunction(()=>!document.getElementById('emailOrder').disabled);
  assert.equal(calls,1);assert.equal(await page.locator('#orderSuccess').evaluate(e=>e.classList.contains('show')),false);
  assert.equal(await page.locator('#cartTotal').textContent(),'780 ₽');
  await page.unroute('**/send-order.php');
  await page.route('**/send-order.php',r=>r.fulfill({status:204}));
  await page.locator('#emailOrder').click();
  await page.waitForFunction(()=>document.getElementById('orderSuccess').classList.contains('show'));
  assert.equal(await page.locator('#cartTotal').textContent(),'0 ₽');
  await page.locator('#successRepeat').click();
  assert.equal(await page.locator('#cartTotal').textContent(),'780 ₽');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#cartPanel').evaluate(e=>e.inert),true);
  // Corrupt persisted state must not inject markup or poison totals.
  await page.evaluate(()=>localStorage.setItem('cw_order_v3',JSON.stringify({qty:{1:'<img src=x onerror=alert(1)>',2:-5,3:1.5,4:10000},mode:'delivery'})));
  await page.reload();
  assert.equal(await page.locator('#cartProducts img[src="x"]').count(),0);
  assert.equal(await page.locator('#cartTotal').textContent(),'32030 ₽'.replace('32030','32 030'));
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});
   for(const name of ['index.html','catalog.html','about.html','delivery.html','faq.html','contacts.html','privacy.html']) {
    await page.goto('http://127.0.0.1:8765/'+name);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} overflows at ${width}`);
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: catalog, sorting, cart totals/minimums, consents, past date, false success, successful response, repeat, corrupt storage, 28 responsive page checks; no JS errors.');
 } finally {if(browser) await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
