const modal = document.querySelector('[data-modal]');

  function openModal(furnitureItem) {
    document.body.style.overflow = 'hidden';
    modal.classList.remove('is-hidden');

    modal.querySelector('.modal-title').textContent = furnitureItem.name;
    modal.querySelector('.modal-category').textContent = furnitureItem.category;
    modal.querySelector('.modal-price').textContent = `${furnitureItem.price} ₴`;
    modal.querySelector('.modal-description').textContent = furnitureItem.description;
    modal.querySelector('.modal-sizes').textContent = furnitureItem.sizes;

    renderGallery(furnitureItem.images);
    renderStars(furnitureItem.rating);
    renderColors(furnitureItem.colors);
  }

  function renderGallery(images) {
    const gallery = modal.querySelector('.modal-gallery');
    gallery.innerHTML = images.map(url => `<img src="${url}" alt="" />`).join('');
  }

  function renderStars(rating) {
    const container = modal.querySelector('.modal-rating');
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<svg class="star"><use href="#icon-star"></use></svg>';
    }
    if (halfStar) starsHtml += '<svg class="star"><use href="#icon-star-half"></use></svg>';
    while (starsHtml.split('svg').length - 1 < 5) {
      starsHtml += '<svg class="star"><use href="#icon-star-empty"></use></svg>';
    }
    container.innerHTML = starsHtml;
  }

  function renderColors(colors) {
  const container = modal.querySelector('.modal-colors');
  const title = `<p class="color-label-title">Колір</p>`;

  const labels = colors
    .map((color, i) => `
      <label class="color-label">
        <input type="radio" name="color" value="${color}" ${i === 0 ? 'checked' : ''} />
        <span class="color-dot" style="background-color:${color}"></span>
      </label>
    `)
    .join('');

  const group = `<div class="color-label-group">${labels}</div>`;

  container.innerHTML = title + group;
}



  modal.addEventListener('click', e => {
    if (e.target.dataset.close || e.target === modal) closeModal();
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

  // Мокові дані для тесту
const testFurniture = {
  name: 'М’яке крісло',
  category: 'Крісла',
  price: 2500,
  description: 'Зручне крісло з м’якою оббивкою та дерев’яними ніжками.',
  sizes: '80x75x90 см',
  rating: 4.5,
  colors: ['#a52a2a', '#4682b4', '#2e8b57'],
  images: [
    'https://via.placeholder.com/150x100?text=Фото+1',
    'https://via.placeholder.com/150x100?text=Фото+2',
  ],
};

document.querySelector('#test-open')?.addEventListener('click', () => {
  openModal(testFurniture);
});
