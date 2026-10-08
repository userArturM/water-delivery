/* Мобильное меню — отдельный скрипт, не зависит от app.js */
(function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  var y0 = 0;
  function set(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    y0 = window.pageYOffset || 0;
  }
  btn.setAttribute('aria-controls', 'mobileMenu');
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    set(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.closest && e.target.closest('a')) set(false);
  });
  document.addEventListener('click', function () {
    if (menu.classList.contains('open')) set(false);
  });
  window.addEventListener('scroll', function () {
    if (menu.classList.contains('open') && Math.abs((window.pageYOffset || 0) - y0) > 80) set(false);
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') set(false);
  });
})();
