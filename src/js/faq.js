document.querySelectorAll('.accordion').forEach(acc => {
  acc.addEventListener('show.bs.collapse', e => {
    e.target.closest('.accordion-item').classList.add('active');
  });
  acc.addEventListener('hide.bs.collapse', e => {
    e.target.closest('.accordion-item').classList.remove('active');
  });
});