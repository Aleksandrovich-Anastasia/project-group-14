const modal = document.querySelector('[data-modal]');

function openModal(furnitureItem) {
  document.body.style.overflow = 'hidden';
  modal.classList.remove('is-hidden');

  modal.querySelector('.modal-title').textContent = furnitureItem.name;
  modal.querySelector('.modal-category').textContent = furnitureItem.category;
  modal.querySelector('.modal-price').textContent = `${furnitureItem.price} ₴`;
  modal.querySelector('.modal-description').textContent =
    furnitureItem.description;
  modal.querySelector('.modal-sizes').textContent = furnitureItem.sizes;

  renderGallery(furnitureItem.images);
  renderStars(furnitureItem.rating);
  furnitureItem.colors = ['#c7c3bb', '#c7aa80', '#201a19']; // кольори з макету
  renderColors(furnitureItem.colors);
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
    .map(
      (url, i) =>
        `<div class="thumb"><img src="${url}" alt="Фото ${i + 2}" /></div>`
    )
    .join('');

  const thumbsRow = `<div class="thumbs-row">${thumbnails}</div>`;

  gallery.innerHTML = mainImage + thumbsRow;
}

function renderStars(rating) {
  const container = modal.querySelector('.modal-rating');
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml +=
      '<svg class="star"><use href="./img/sprite.svg#icon-star"></use></svg>';
  }
  if (halfStar)
    starsHtml +=
      '<svg class="star"><use href="./img/sprite.svg#icon-star-half"></use></svg>';
  while (starsHtml.split('svg').length - 1 < 5) {
    starsHtml +=
      '<svg class="star"><use href="./img/sprite.svg#icon-star-empty"></use></svg>';
  }
  container.innerHTML = starsHtml;
}

function renderColors(colors) {
  const container = modal.querySelector('.modal-colors');
  const title = `<p class="color-label-title">Колір</p>`;
  const labels = colors
    .map(
      (color, i) => `
      <label class="color-label">
        <input type="radio" name="color" value="${color}" ${
        i === 0 ? 'checked' : ''
      } />
        <span class="color-dot" style="background-color:${color}"></span>
      </label>
    `
    )
    .join('');

  const group = `<div class="color-label-group">${labels}</div>`;

  container.innerHTML = title + group;
}

modal.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target === modal) closeModal();
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  modal.classList.add('is-hidden');
  document.body.style.overflow = 'auto';
}

document.querySelector('[data-order]')?.addEventListener('click', () => {
  closeModal();
});

const testFurniture = {
  name: 'Софа Oslo',
  category: 'Дивани',
  price: 9900,
  description:
    'Класичний диван з мякими подушками та високою спинкою, ідеальний для сімейного відпочинку. Оббивка з якісної зносостійкої тканини.',
  sizes: 'Розмір: 80x75x90',
  rating: 4.5,
  colors: ['#a52a2a', '#4682b4', '#2e8b57'],
  images: [
    'https://picsum.photos/id/1018/600/400',
    'https://picsum.photos/id/1015/150/100',
    'https://picsum.photos/id/1016/150/100',
  ],
};

document.querySelector('#test-open')?.addEventListener('click', () => {
  openModal(testFurniture);
});

export { openModal };
