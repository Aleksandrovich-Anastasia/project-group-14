const burgerBtn = document.querySelector('[data-menu-open]');
const closeBtn = document.querySelector('[data-menu-close]');
const menu = document.querySelector('.menu-header');
const body = document.body;

// Відкрити меню
burgerBtn.addEventListener('click', () => {
  menu.classList.add('is-open');
  body.classList.add('no-scroll');
  burgerBtn.style.display = 'none';
  closeBtn.style.display = 'block';
});

// Закрити меню
function closeMenu() {
  menu.classList.remove('is-open');
  body.classList.remove('no-scroll');
  closeBtn.style.display = 'none';
  burgerBtn.style.display = 'block';
}

closeBtn.addEventListener('click', closeMenu);

// Закрити по Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
  }
});

// Закрити при кліку поза меню
document.addEventListener('click', e => {
  if (
    menu.classList.contains('is-open') &&
    !e.target.closest('.menu-header') &&
    !e.target.closest('[data-menu-open]')
  ) {
    closeMenu();
  }
});

// Закрити при переході по якірних посиланнях
menu.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  });
});
