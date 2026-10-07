
// Аналитика загружается только после отдельного добровольного согласия пользователя.
const ANALYTICS_KEY = 'cw_analytics_consent_v1';
const YANDEX_ID = 113385913;
function loadAnalytics() {
  if (window.__cwAnalyticsLoaded) return;
  window.__cwAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t); a=e.getElementsByTagName(t)[0]; k.async=1; k.src=r; a.parentNode.insertBefore(k,a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + YANDEX_ID, 'ym');
  ym(YANDEX_ID, 'init', {ssr:true, webvisor:false, clickmap:true, ecommerce:'dataLayer', referrer:document.referrer, url:location.href, accurateTrackBounce:true, trackLinks:true});
}
function analyticsConsentState() {
  try { return localStorage.getItem(ANALYTICS_KEY); } catch (_) { return null; }
}
function setAnalyticsConsent(value) {
  try { localStorage.setItem(ANALYTICS_KEY, value); } catch (_) {}
  const banner = document.getElementById('cookieConsent');
  if (banner) banner.remove();
  if (value === 'granted') loadAnalytics();
}
function initAnalyticsConsent() {
  const state = analyticsConsentState();
  if (state === 'granted') { loadAnalytics(); return; }
  if (state === 'denied') return;
  const banner = document.createElement('div');
  banner.id = 'cookieConsent';
  banner.className = 'cookie-consent';
  banner.innerHTML = `<div class="cookie-consent-inner"><div><b>Настройки аналитики</b><p>Мы используем «Яндекс Метрику» только для анализа работы сайта. Аналитика и Вебвизор не запускаются без вашего отдельного согласия. Подробнее — в <a href="privacy.html">Политике обработки персональных данных</a>.</p></div><div class="cookie-consent-actions"><button type="button" data-analytics="deny">Только необходимые</button><button type="button" class="primary" data-analytics="grant">Разрешить аналитику</button></div></div>`;
  document.body.appendChild(banner);
  banner.addEventListener('click', e => {
    const b = e.target.closest('[data-analytics]');
    if (b) setAnalyticsConsent(b.dataset.analytics === 'grant' ? 'granted' : 'denied');
  });
}
initAnalyticsConsent();

// Подсветка активного раздела: определяется по текущей странице, а не по позиции ссылки.
function getCurrentPage() {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  return file || 'index.html';
}
function markActiveNavigation() {
  const current = getCurrentPage();
  const aliases = {
    'delivery-payment.html': 'delivery.html'
  };
  const navCurrent = aliases[current] || current;
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
    link.classList.toggle('is-active', href === navCurrent || (current === 'index.html' && href === 'index.html'));
    link.setAttribute('aria-current', href === navCurrent ? 'page' : 'false');
  });
}

// Единый футер сайта — редактируется только здесь.
function initSiteFooter() {
  const footer = document.getElementById('siteFooter');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="footer-shell">
      <div class="container footer-top">
        <a class="footer-brand" href="index.html" aria-label="Чистая вода — на главную">
          <span class="footer-brand-mark"><img src="assets/logo.png" alt=""></span>
          <span class="footer-brand-copy"><b>Чистая вода</b><small>Доставка питьевой воды</small></span>
        </a>

        <nav class="footer-nav" aria-label="Навигация в подвале">
          <a class="footer-nav-link" href="index.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/></svg><span>Главная</span></a>
          <a class="footer-nav-link" href="catalog.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg><span>Каталог</span></a>
          <a class="footer-nav-link" href="delivery-payment.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg><span>Доставка и оплата</span></a>
          <a class="footer-nav-link" href="returns.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 010 8h-3"/></svg><span>Возврат</span></a>
          <a class="footer-nav-link" href="offer.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></svg><span>Оферта</span></a>
          <a class="footer-nav-link" href="privacy.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/></svg><span>Политика ПДн</span></a>
          <a class="footer-nav-link" href="requisites.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10h6M7 14h4"/></svg><span>Реквизиты</span></a>
          <a class="footer-nav-link" href="contacts.html"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg><span>Контакты</span></a>
        </nav>

        <div class="footer-contact">
          <a class="footer-phone" href="tel:+79282235333"><span class="footer-phone-icon"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/></svg></span><span><b>+7 928 223-53-33</b><small>Звоните с 08:00 до 20:00</small></span></a>
</div>
      </div>

      <div class="container footer-divider"></div>

      <div class="container footer-bottom">
        <div class="footer-details">
          <a href="contacts.html" class="footer-detail"><span class="footer-detail-icon"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg></span>ст. Пластуновская, ул. Красная, 250</a>
          <a href="mailto:internet.list@internet.ru" class="footer-detail"><span class="footer-detail-icon"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5L12 13l8.5-5.5"/></svg></span>internet.list@internet.ru</a>
        </div>
        <div class="footer-meta">
          <span>© ${year} Чистая вода · ИП Манукян Артур Баградович · ИНН 233016185364 · ОГРНИП 325237500551005</span>
          <button class="footer-settings" type="button" id="analyticsSettings">Настройки аналитики</button>
          <a class="footer-up" href="#top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;" aria-label="Наверх"><svg class="fi " viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg> <span>Наверх</span></a>
        </div>
      </div>
    </div>`;
}
initSiteFooter();

// Подсветка активного пункта футера по текущей странице.
(function markActiveFooter(){
  const current = getCurrentPage();
  const aliases = { 'delivery-payment.html': 'delivery.html' };
  const footerCurrent = aliases[current] || current;
  document.querySelectorAll('.footer-nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
    const active = href === current || href === footerCurrent;
    link.classList.toggle('is-accent', active);
    link.setAttribute('aria-current', active ? 'page' : 'false');
  });
})();
markActiveNavigation();
document.getElementById('analyticsSettings')?.addEventListener('click', () => {
  try { localStorage.removeItem(ANALYTICS_KEY); } catch (_) {}
  document.getElementById('cookieConsent')?.remove();
  initAnalyticsConsent();
});

const waters = [
  ['butyl-tara','Бутыль тара','Тара для воды','assets/tara.webp',320,320,19],
  ['cristal','Кристальная','Вода питьевая «Кристальная»','assets/water/kristalnaya.webp',210,155,19],
  ['kubai','Кубай','Вода питьевая «Кубай»','assets/water/kubai.webp',395,345,19],
  ['dombay','Домбай','Вода питьевая «Домбай»','assets/water/dombay.webp',350,300,19],
  ['chernogolovka','Черноголовка','Вода питьевая «Черноголовка»','assets/water/chernogolovka.webp',320,270,19],
  ['arkhyz','Архыз','Вода питьевая «Архыз»','assets/water/arkhyz.webp',385,335,19],
  ['piligrim','Пилигрим','Вода питьевая «Пилигрим»','assets/water/piligrim.webp',450,400,19],
  ['mountain','Горная вершина','Вода питьевая «Горная вершина»','assets/water/gornaya-vershina.webp',365,315,19],
  ['dysheps','Дышэпс','Вода питьевая «Дышэпс»','assets/water/dysheps.webp',270,220,19],
  ['belaya','Белая рука','Вода питьевая «Белая рука»','assets/water/belaya-ruka.webp',210,155,19],
  ['prirodny','Природный источник','Вода питьевая «Природный источник»','assets/water/prirodny-istochnik.webp',177,127,10],
  ['pompa','Помпа механическая','Классическая механическая ручная помпа','assets/water/pompa.webp',420,420,0],
  ['pompakran','Помпа с краном','Механическая помпа с краном','assets/water/pompakran.webp',465,465,0]
];

// --- Населённые пункты и цены доставки ---
// Базовая цена доставки (Пластуновская) — в массиве waters ниже (4-е число в строке).
// TOWN_SURCHARGE — надбавка в ₽ к каждой бутыли воды для пункта (на помпы и тару не действует).
// TOWN_PRICES — точечные цены, если у пункта для какого-то товара своя цена (необязательно).
const TOWNS = {
  plastunovskaya: 'Пластуновская',
  dinskaya: 'Динская',
  ukrainskaya: 'Украинская'
};
const TOWN_SURCHARGE = {
  plastunovskaya: 0,
  dinskaya: 50,
  ukrainskaya: 50
};
const TOWN_PRICES = {
  // dinskaya: { 'kubai': 450 },   // пример: точная цена для одного товара
};
let town = 'plastunovskaya';

let mode = 'delivery';
let cat = 'all';
const isWater = w => !/^(pompa|butyl)/.test(w[0]);
const inCat = w => cat === 'all' || (cat === 'water') === isWater(w);
const qty = Object.create(null);
const LS = 'cw_order_v3';
try { localStorage.removeItem('cw_order_v2'); localStorage.removeItem('cw_last_order_v1'); } catch(e) {}
let saved = {};
try { saved = JSON.parse(localStorage.getItem(LS) || '{}'); } catch(e) {}
if (saved.qty) Object.assign(qty, saved.qty);
if (saved.mode === 'store' || saved.mode === 'delivery') mode = saved.mode;
if (saved.town && TOWNS[saved.town]) town = saved.town;

function priceOf(w) {
  if (mode !== 'delivery') return w[5];
  const o = TOWN_PRICES[town] && TOWN_PRICES[town][w[0]];
  if (typeof o === 'number') return o;
  return w[4] + (isWater(w) ? (TOWN_SURCHARGE[town] || 0) : 0);
}

const grid = document.getElementById('grid');
const cartPanel = document.getElementById('cartPanel');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartFab = document.getElementById('cartFab');
const fabCount = document.getElementById('fabCount');
const cartClear = document.getElementById('cartClear');
const storeAddress = document.getElementById('storeAddress');
const cartFabMobile = document.getElementById('cartFabMobile');
const fabCountMobile = document.getElementById('fabCountMobile');
const orderSuccess = document.getElementById('orderSuccess');
const successClose = document.getElementById('successClose');
const cartTotal = document.getElementById('cartTotal');
const cartProducts = document.getElementById('cartProducts');
const cartStepProducts = document.getElementById('cartStepProducts');
const cartStepDetails = document.getElementById('cartStepDetails');
const cartTitle = document.getElementById('cartTitle');
const cartNext = document.getElementById('cartNext');
const cartBack = document.getElementById('cartBack');
const detailsTotal = document.getElementById('detailsTotal');
const orderName = document.getElementById('orderName');
const orderAddress = document.getElementById('orderAddress');
const orderDate = document.getElementById('orderDate');
const orderPayment = document.getElementById('orderPayment');
const orderPhone = document.getElementById('orderPhone');
const orderComment = document.getElementById('orderComment');
const personalConsent = document.getElementById('personalConsent');
const privacyConsent = document.getElementById('privacyConsent');
const offerConsent = document.getElementById('offerConsent');

/* Любая из галочек синхронно отмечает/снимает весь блок согласий. */
const consentChecks = [personalConsent, privacyConsent, offerConsent].filter(Boolean);
consentChecks.forEach(check => {
  check.addEventListener('change', () => {
    consentChecks.forEach(item => { item.checked = check.checked; });
  });
});

const successText = document.getElementById('successText');
const emailOrder = document.getElementById('emailOrder');
const cartRecommendations = document.getElementById('cartRecommendations');
const successRepeat = document.getElementById('successRepeat');

function money(n) { return n.toLocaleString('ru-RU') + ' ₽'; }

function makeOrderNumber() {
  const d = new Date();
  const date = d.getFullYear().toString() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  const rnd = Math.floor(1000 + Math.random()*9000);
  return `CW-${date}-${rnd}`;
}

function saveState() {
  try {
    localStorage.setItem(LS, JSON.stringify({ qty, mode, town }));
  } catch(e) {}
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 4000);
}

function control(i) {
  // В режиме «Самовывоз» кнопки добавления/изменения количества
  // у товаров каталога не показываем.
  if (mode === 'store') return '';
  const q = qty[i] || 0;
  return q
    ? `<span class="qty-step"><button type="button" data-cart="minus" data-i="${i}" aria-label="Уменьшить">−</button><b>${q}</b><button type="button" data-cart="plus" data-i="${i}" aria-label="Увеличить">+</button></span>`
    : `<button type="button" class="add" data-cart="plus" data-i="${i}">Добавить</button>`;
}

function render() {
  if (!grid) return;
  grid.innerHTML = waters.map((w, i) => {
    if (!inCat(w)) return '';
    return `
    <article class="card reveal" style="transition-delay:${(i % 4) * 0.06}s">
      <div class="photo">
        <img loading="lazy" src="${w[3]}" alt="${w[1]}${isWater(w) ? ', ' + w[6] + ' л' : ''}"
          onerror="this.onerror=null;this.src='assets/logo.png'">
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3>${w[1]}</h3>
          ${i === 1 ? `<span class="badge badge-hit">Хит</span>` :
            i === 0 ? `<span class="badge badge-deal">Выгодная цена</span>` :
            (isWater(w) && w[6] ? `<span class="badge">${w[6]} л</span>` : '')}
        </div>
        <div class="desc">${w[2]}</div>
        <div class="buy">
          <div class="price-wrap">
            <strong class="price">${money(priceOf(w))}</strong>
            <span class="price-caption">${mode === 'delivery' ? 'цена с доставкой — ' + TOWNS[town] : 'цена в магазине'}</span>
          </div>
          <span id="cart-control-${i}">${control(i)}</span>
        </div>
      </div>
    </article>`;
  }).join('');
  observe(grid.querySelectorAll('.reveal'));
}

function flyToCart(btn) {
  const rect = btn.getBoundingClientRect();
  const targetFab = cartFab;
  if (!targetFab) return;
  const fab = targetFab.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'fly-item';
  el.style.left = rect.left + rect.width / 2 - 24 + 'px';
  el.style.top = rect.top + rect.height / 2 - 24 + 'px';
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = `translate(${fab.left - rect.left}px, ${fab.top - rect.top}px) scale(0.3)`;
    el.style.opacity = '0';
  });
  setTimeout(() => el.remove(), 750);
}

// --- Минимальный заказ: от 2 бутылей воды (помпы и тара не учитываются) ---
// Пластуновская — от 2 бутылей, Динская и Украинская — от 3 (только при доставке).
const TOWN_MIN_BOTTLES = { plastunovskaya: 2, dinskaya: 3, ukrainskaya: 3 };
function minBottles() {
  return mode === 'delivery' ? (TOWN_MIN_BOTTLES[town] || 2) : 2;
}
function bottlesWord(n) { return n === 1 ? 'бутыль' : (n < 5 ? 'бутыли' : 'бутылей'); }
function minText() { const n = minBottles(); return `Минимальный заказ — ${n} ${bottlesWord(n)} воды`; }
function bottleCount() {
  return waters.reduce((s, w, i) => s + (isWater(w) ? (Number(qty[i]) || 0) : 0), 0);
}

function updateCart() {
  if (!cartProducts) return;
  let total = 0;
  let productHtml = [];
  waters.forEach((w, i) => {
    const q = qty[i] || 0;
    if (q) {
      const price = priceOf(w);
      total += q * price;
      productHtml.push(`
        <div class="cart-product">
          <div class="cart-product-left">
            <img class="cart-product-thumb" loading="lazy" src="${w[3]}" alt="${w[1]}" onerror="this.style.display='none'">
            <div class="cart-product-main">
              <b>${w[1]}</b>
              <span>${money(price)} / шт.</span>
              <span class="cart-qty">
                <button type="button" data-cart="minus" data-i="${i}" aria-label="Уменьшить">−</button>
                <b>${q}</b>
                <button type="button" data-cart="plus" data-i="${i}" aria-label="Увеличить">+</button>
              </span>
            </div>
          </div>
          <div class="cart-product-right">
            <strong>${money(q * price)}</strong>
            <button type="button" class="cart-remove" data-cart="remove" data-i="${i}" aria-label="Удалить ${w[1]}">×</button>
          </div>
        </div>`);
    }
    const el = document.getElementById(`cart-control-${i}`);
    if (el) el.innerHTML = control(i);
  });

  const itemCount = Object.values(qty).reduce((s, v) => s + (Number(v) || 0), 0);
  if (cartFab) cartFab.classList.toggle('has-items', total > 0);
  const countText = itemCount > 99 ? '99+' : String(itemCount);
  if (fabCount) fabCount.textContent = countText;
  if (fabCountMobile) fabCountMobile.textContent = countText;
  if (cartTotal) cartTotal.textContent = money(total);
  if (cartClear) cartClear.classList.toggle('show', total > 0);
  if (cartRecommendations) cartRecommendations.hidden = total <= 0;
  if (storeAddress) storeAddress.classList.toggle('show', mode === 'store');
  document.querySelectorAll('.price-caption').forEach(p => {
    p.textContent = mode === 'delivery' ? 'цена с доставкой — ' + TOWNS[town] : 'цена в магазине';
  });
  if (detailsTotal) detailsTotal.textContent = money(total);
  document.querySelectorAll('[data-quick-add]').forEach(b => {
    const w = waters[Number(b.dataset.quickAdd)];
    const s = b.querySelector('small');
    if (w && s) s.textContent = w[6] + ' л · ' + money(priceOf(w));
  });
  const minEl = document.getElementById('minOrderInfo');
  if (minEl) minEl.textContent = minText();
  const ts = document.getElementById('townSwitch');
  if (ts) ts.hidden = mode !== 'delivery';
  const tsel = document.getElementById('townSelect');
  if (tsel && tsel.value !== town) tsel.value = town;
  if (cartProducts) cartProducts.innerHTML = productHtml.length ? productHtml.join('') : '<div class="cart-empty">Товары не выбраны</div>';
  const bottles = bottleCount();
  const enoughBottles = bottles >= minBottles();
  if (cartProducts && productHtml.length && !enoughBottles) {
    cartProducts.innerHTML += `<div class="min-order-hint">${minText()}. ${bottles ? 'Добавьте ещё ' + (minBottles() - bottles) + ' ' + bottlesWord(minBottles() - bottles) + ' воды.' : 'Помпа и тара в это количество не входят.'}</div>`;
  }
  if (cartNext) cartNext.disabled = total <= 0 || !enoughBottles;
  saveState();
  if (total <= 0) closeCart();

  const receive = mode === 'delivery' ? 'доставка' : 'самовывоз';
  const lines = [`Здравствуйте! Хочу заказать (${receive}${mode === 'delivery' ? ', ' + TOWNS[town] : ''}):`];
  let n = 0;
  waters.forEach((w, i) => {
    const q = qty[i] || 0;
    if (q) {
      n++;
      const price = priceOf(w);
      lines.push(`${n}. ${w[1]} — ${q} × ${price} ₽ = ${q * price} ₽`);
    }
  });
  lines.push(`Итого: ${money(total)}`);
  if (orderAddress.value.trim()) lines.push(`Адрес: ${orderAddress.value.trim()}`);
  if (orderDate.value) {
    const [y, m, d] = orderDate.value.split('-');
    lines.push(`Дата: ${d}.${m}.${y}`);
  }
  if (orderPhone.value.trim()) lines.push(`Телефон: ${orderPhone.value.trim()}`);
  if (orderPayment.value) lines.push(`Оплата: ${orderPayment.value}`);
  if (orderName.value.trim()) lines.push(`Имя: ${orderName.value.trim()}`);
  if (orderComment.value.trim()) lines.push(`Комментарий: ${orderComment.value.trim()}`);
  const orderNumber = window.__orderNumber || makeOrderNumber();
  window.__orderNumber = orderNumber;
  lines.unshift(`Заказ №${orderNumber}`);

  window.__orderText = lines.join('\n');
  const needsAddress = receive === 'доставка';
  if (orderAddress) orderAddress.required = needsAddress;
  if (orderAddress) orderAddress.placeholder = needsAddress ? 'Адрес доставки *' : 'Адрес / примечание';
  if (orderDate) orderDate.required = needsAddress;
  if (orderPhone) orderPhone.required = needsAddress;
  if (orderDate) orderDate.disabled = !needsAddress;
}

function openCart() {
  if (!cartPanel || !cartFab || !cartFab.classList.contains('has-items')) return;
  cartStepProducts.hidden = false;
  cartStepDetails.hidden = true;
  cartTitle.textContent = 'Ваша корзина';
  cartPanel.classList.add('open');
  cartBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (!cartPanel) return;
  cartPanel.classList.remove('open');
  cartBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  cartStepDetails.hidden = true;
  cartStepProducts.hidden = false;
  cartTitle.textContent = 'Ваша корзина';
}

if (cartFab) cartFab.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
cartBackdrop?.addEventListener('click', closeCart);

cartNext?.addEventListener('click', () => {
  if (bottleCount() < minBottles()) { toast(minText()); return; }
  cartStepProducts.hidden = true;
  cartStepDetails.hidden = false;
  cartTitle.textContent = 'Данные заказа';
  setTimeout(() => orderName.focus(), 150);
});
cartBack?.addEventListener('click', () => {
  cartStepDetails.hidden = true;
  cartStepProducts.hidden = false;
  cartTitle.textContent = 'Ваша корзина';
});

// --- Яндекс Метрика: цели ---

// Отправка заказа на e-mail продавца через PHP на хостинге REG.RU.
async function sendOrderCopyByEmail() {
  try {
    const data = new FormData();
    data.append('order_number', String(window.__orderNumber || ''));
    data.append('order_text', String(window.__orderText || ''));
    data.append('page', window.location.href);
    data.append('sent_at', new Date().toISOString());
    data.append('personal_consent', personalConsent?.checked ? '1' : '0');
    data.append('privacy_acknowledgement', privacyConsent?.checked ? '1' : '0');
    data.append('offer_acceptance', offerConsent?.checked ? '1' : '0');
    data.append('consent_version', '2026-10-04');
    data.append('privacy_version', '2026-10-04');
    data.append('offer_version', '2026-10-04');
    data.append('consent_at_client', new Date().toISOString());
    data.append('website', '');
    const res = await fetch('./send-order.php', {
      method: 'POST', body: data, keepalive: true, credentials: 'same-origin'
    });
    if (!res.ok && res.status !== 204) {
      toast('Не удалось отправить заказ на e-mail. Попробуйте ещё раз.');
      return false;
    }
    return true;
  } catch (_) {
    toast('Не удалось отправить заказ на e-mail. Попробуйте ещё раз.');
    return false;
  }
}

function goal(name) {
  try { if (typeof ym === 'function') ym(YANDEX_ID, 'reachGoal', name); } catch (_) {}
}
// клики по телефону
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="tel:"]');
  if (a) goal('click_phone');
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-cart]');
  if (!b) return;
  const i = Number(b.dataset.i);
  const action = b.dataset.cart;
  if (action === 'remove') {
    qty[i] = 0;
    updateCart();
    return;
  }
  const wasZero = !(qty[i] || 0);
  qty[i] = Math.max(0, (qty[i] || 0) + (action === 'plus' ? 1 : -1));
  if (action === 'plus' && wasZero) flyToCart(b);
  if (action === 'plus' && wasZero) goal('add_to_cart');
  updateCart();
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-quick-add]');
  if (!b) return;
  const i = Number(b.dataset.quickAdd);
  if (!Number.isInteger(i) || !waters[i]) return;
  qty[i] = (qty[i] || 0) + 1;
  updateCart();
  goal('quick_add_to_cart');
  toast(`${waters[i][1]} добавлена в корзину`);
});

document.querySelectorAll('#modeSwitch button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#modeSwitch button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    render();
    updateCart();
    document.querySelectorAll('.price,.price-caption').forEach(p => {
      p.classList.remove('pulse','pulse-caption');
      void p.offsetWidth;
      p.classList.add(p.classList.contains('price-caption') ? 'pulse-caption' : 'pulse');
    });
  });
});

document.getElementById('townSelect')?.addEventListener('change', e => {
  if (!TOWNS[e.target.value]) return;
  town = e.target.value;
  render();
  updateCart();
  document.querySelectorAll('.price,.price-caption').forEach(p => {
    p.classList.remove('pulse','pulse-caption');
    void p.offsetWidth;
    p.classList.add(p.classList.contains('price-caption') ? 'pulse-caption' : 'pulse');
  });
});

document.querySelectorAll('#catSwitch button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#catSwitch button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cat = btn.dataset.cat;
    render();
    updateCart();
  });
});

let io = null;
try {
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  }
} catch (err) { io = null; }

function observe(els) {
  els.forEach(el => {
    if (io) io.observe(el);
    else el.classList.add('visible');
  });
}

observe(document.querySelectorAll('.reveal'));

const today = new Date();
if (orderDate) orderDate.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
orderDate?.addEventListener('click', () => {
  if (!orderDate.disabled && typeof orderDate.showPicker === 'function') {
    try { orderDate.showPicker(); } catch (e) {}
  }
});

if (personalConsent) personalConsent.checked = false;
if (privacyConsent) privacyConsent.checked = false;
if (offerConsent) offerConsent.checked = false;

document.querySelectorAll('#modeSwitch button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

[orderName, orderAddress, orderPhone, orderComment].filter(Boolean).forEach(el => el.classList.add('ym-disable-keys'));

[orderName, orderAddress, orderDate, orderPayment, orderPhone, orderComment, personalConsent, privacyConsent, offerConsent].filter(Boolean).forEach(el => {
  el.addEventListener('input', () => { el.style.borderColor = ''; updateCart(); });

  el.addEventListener('change', updateCart);
});

if (emailOrder) {
  emailOrder.addEventListener('click', async e => {
    e.preventDefault();
    const bad = (el, msg) => { el.style.borderColor = '#d33'; el.focus(); toast(msg); };
    if (bottleCount() < minBottles()) { toast(minText()); return; }
    if (!personalConsent?.checked) { toast('Подтвердите согласие на обработку персональных данных'); personalConsent?.focus(); return; }
    if (!privacyConsent?.checked) { toast('Подтвердите ознакомление с Политикой обработки персональных данных'); privacyConsent?.focus(); return; }
    if (!offerConsent?.checked) { toast('Подтвердите ознакомление с публичной офертой'); offerConsent?.focus(); return; }
    if (mode === 'delivery') {
      if (!orderAddress.value.trim()) return bad(orderAddress, 'Укажите адрес доставки');
      if (!orderDate.value) return bad(orderDate, 'Выберите дату доставки');
    }
    if (mode === 'delivery' || orderPhone.value.trim()) {
      if (orderPhone.value.replace(/\D/g, '').length < 10) return bad(orderPhone, 'Укажите телефон (не меньше 10 цифр)');
    }

    emailOrder.disabled = true;
    emailOrder.classList.add('is-loading');
    const sent = await sendOrderCopyByEmail();
    emailOrder.disabled = false;
    emailOrder.classList.remove('is-loading');

    if (!sent) {
      toast('Не удалось отправить заказ на почту. Попробуйте ещё раз.');
      return;
    }

    try {
      localStorage.setItem('cw_last_order_v2', JSON.stringify({qty:{...qty}, mode, town}));
    } catch (_) {}
    goal('order_email');
    showSuccess();
  });
}



function formatPhone(value) {
  let d = String(value || '').replace(/\D/g,'');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0,11);
  let s = '+7';
  if (d.length > 1) s += ' (' + d.slice(1,4);
  if (d.length >= 4) s += ') ' + d.slice(4,7);
  if (d.length >= 7) s += '-' + d.slice(7,9);
  if (d.length >= 9) s += '-' + d.slice(9,11);
  return s;
}
orderPhone?.addEventListener('input', () => {
  if (orderPhone) orderPhone.value = formatPhone(orderPhone.value);
  orderPhone.style.borderColor = '';
  updateCart();
});

if (cartClear) cartClear.addEventListener('click', () => {
  Object.keys(qty).forEach(k => qty[k] = 0);
  updateCart();
  toast('Корзина очищена');
});
if (successClose) successClose.addEventListener('click', () => orderSuccess.classList.remove('show'));
if (successRepeat) successRepeat.addEventListener('click', () => {
  try {
    const last = JSON.parse(localStorage.getItem('cw_last_order_v2') || 'null');
    if (!last || !last.qty) { toast('Последний заказ ещё не сохранён'); return; }
    Object.keys(qty).forEach(k => qty[k] = 0);
    Object.assign(qty, last.qty);
    mode = last.mode === 'store' ? 'store' : 'delivery';
    if (last.town && TOWNS[last.town]) town = last.town;
    document.querySelectorAll('#modeSwitch button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    render(); updateCart();
    orderSuccess.classList.remove('show');
    openCart();
    goal('repeat_order');
  } catch (_) { toast('Не удалось восстановить последний заказ'); }
});



function showSuccess() {
  if (successText) successText.textContent = `Заказ успешно отправлен. После обработки мы свяжемся с вами для подтверждения.`;
  orderSuccess.classList.add('show');
}
function hideSplash() {
  const s = document.getElementById('splash');
  if (s) setTimeout(() => s.classList.add('hide'), 650);
}
hideSplash();

// Установка PWA: браузер сам покажет возможность установки, когда выполнены его условия.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

render();
updateCart();


const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));

/* ===== Главная: карусель ассортимента и счётчики ===== */
(function initHomeExtras(){
  const car = document.getElementById('homeCarousel');
  if (car && typeof waters !== 'undefined') {
    car.innerHTML = waters.map(w => `
      <article class="pcard">
        <div class="pcard-img"><img loading="lazy" src="${w[3]}" alt="${w[1]}${isWater(w) && w[6] ? ', ' + w[6] + ' л' : ''}" onerror="this.onerror=null;this.src='assets/logo.png'"></div>
        <h3>${w[1]}</h3>
        <div class="pcard-price">${mode === 'delivery' ? 'с доставкой' : 'в магазине'} <b>${money(priceOf(w))}</b>${isWater(w) && w[6] ? ' / ' + w[6] + ' л' : ''}</div>
        <p>${w[2]}</p>
        <a class="btn-primary" href="catalog.html">Заказать</a>
      </article>`).join('');
    const prev = document.getElementById('carPrev');
    const next = document.getElementById('carNext');
    const step = () => {
      const c = car.querySelector('.pcard');
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(car).columnGap || 0) : 320;
    };
    const sync = () => {
      if (!prev || !next) return;
      prev.disabled = car.scrollLeft < 4;
      next.disabled = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4;
    };
    prev && prev.addEventListener('click', () => car.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => car.scrollBy({ left: step(), behavior: 'smooth' }));
    car.addEventListener('scroll', sync, { passive: true });
    car.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') car.scrollBy({ left: step(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft') car.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    window.addEventListener('resize', sync);
    sync();
  }

  // Счётчики в блоке «Коротко о нас»: считаем от нуля, когда блок виден.
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const run = el => {
      const end = parseInt(el.dataset.count, 10) || 0;
      if (reduce) { el.textContent = end; return; }
      const t0 = performance.now(), dur = 1400;
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { run(e.target); io2.unobserve(e.target); }
      }), { threshold: .6 });
      counters.forEach(el => io2.observe(el));
    }
  }
})();
