import { openOrderModal } from './order-modal.js';

const modal = document.querySelector('[data-modal]');

let tempFurnitureId = null;
let tempMarker = null;

function openModal(furnitureItem) {
  document.body.style.overflow = 'hidden';
  modal.classList.remove('is-hidden');

  // Зберігаємо ID і marker тимчасово
  tempFurnitureId = furnitureItem._id || furnitureItem.id || '';
  tempMarker = furnitureItem.marker || '';

  modal.querySelector('.modal-title').textContent = furnitureItem.name;
  modal.querySelector('.modal-category').textContent = furnitureItem.category.name;
  modal.querySelector('.modal-price').textContent = `${furnitureItem.price} грн`;
  modal.querySelector('.modal-description').textContent = furnitureItem.description;
  modal.querySelector('.modal-sizes').textContent = `Розміри: ${furnitureItem.sizes}`;

  renderGallery(furnitureItem.images);
  renderStars(furnitureItem.rate);

  // Використовуємо кольори з API, без хардкоду
  renderColors(furnitureItem.color || []);
}

function renderGallery(images) {
  const gallery = modal.querySelector('.modal-gallery');
  if (!images || images.length === 0) {
    gallery.innerHTML = '<p>Немає зображень</p>';
    return;
  }
  const mainImage = `<div class="main-image"><img src="${images[0]}" alt="Основне фото" /></div>`;
  const thumbnails = images
    .slice(1)
    .map((url, i) => `<div class="thumb"><img src="${url}" alt="Фото ${i + 2}" /></div>`)
    .join('');
  gallery.innerHTML = mainImage + `<div class="thumbs-row">${thumbnails}</div>`;
}

function renderStars(rate) {
  const container = modal.querySelector('.modal-rate');
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let starsHtml = '';

  starsHtml += '<svg class="modal-star">'.repeat(fullStars).replace(/>/g, '><use href="./img/sprite.svg#icon-star"></use></svg>');
  if (halfStar) starsHtml += '<svg class="modal-star"><use href="./img/sprite.svg#icon-star-half"></use></svg>';
  starsHtml += '<svg class="modal-star">'.repeat(emptyStars).replace(/>/g, '><use href="./img/sprite.svg#icon-star-empty"></use></svg>');

  container.innerHTML = starsHtml;
}

function renderColors(colors) {
  const container = modal.querySelector('.modal-colors');
  const title = `<p class="color-label-title">Колір</p>`;
  const labels = colors
    .map(
      (color, i) => `
      <label class="color-label">
        <input type="radio" name="color" value="${color}" ${i === 0 ? 'checked' : ''}/>
        <span class="color-dot" style="background-color:${color}"></span>
      </label>`
    )
    .join('');
  container.innerHTML = title + `<div class="color-label-group">${labels}</div>`;
}

modal.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target === modal) {
    closeModal();
  }
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

const btnOrder = modal.querySelector('[data-order]');
btnOrder?.addEventListener('click', () => {
  // При закритті модалки з описом — передаємо ID і marker в orderModal
  closeModal();
  openOrderModal(tempFurnitureId, tempMarker);
});

function closeModal() {
  modal.classList.add('is-hidden');
  document.body.style.overflow = 'auto';
}

export { openModal };
