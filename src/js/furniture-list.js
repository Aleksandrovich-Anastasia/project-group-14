import { openModal } from './furniture-detail.js';
const furnitureItems = document.querySelectorAll('.card[data-category-id]');
const container = document.querySelector('.price-list');
const loadMoreBtn = document.getElementById('load-more-btn');
// :small_blue_diamond: ЛОАДЕР: создаём элемент
const loader = document.createElement('div');
loader.classList.add('loader');
loader.innerHTML = `<div class="spinner"></div>`;
document.body.appendChild(loader);
function showLoader() {
  loader.style.display = 'flex';
}
function hideLoader() {
  loader.style.display = 'none';
}
let categoryId = 'all';
let currentPage = 1;
const limit = 8;
let furnitureList = [];
let selectedCategory = null;
const firstCategoryCard = Array.from(furnitureItems).find(
  card => card.dataset.categoryId === 'all'
);
if (firstCategoryCard) {
  firstCategoryCard.classList.add('selected');
  selectedCategory = firstCategoryCard;
  categoryId = firstCategoryCard.dataset.categoryId;
}
// --- Обработка клика на категорию ---
furnitureItems.forEach(card => {
  card.addEventListener('click', e => {
    const clickedCard = e.target.closest('.card');
    if (!clickedCard) return;
    if (selectedCategory) {
      selectedCategory.classList.remove('selected');
    }
    clickedCard.classList.add('selected');
    selectedCategory = clickedCard;
    categoryId = clickedCard.dataset.categoryId;
    console.log('Клик по категории:', categoryId);
    currentPage = 1;
    furnitureList = [];
    
    showLoader();
    fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
      container.innerHTML = '';
      renderFurniture(items);
      loadMoreBtn.style.display = items.length < limit ? 'none' : 'block';
      
      hideLoader();
    });
  });
});
// --- Запрос мебели ---
function fetchFurnitureByCategory(categoryId, page = 1, limit = 8) {
  let url = `https://furniture-store.b.goit.study/api/furnitures?page=${page}&limit=${limit}`;
  if (categoryId && categoryId !== 'all') {
    url += `&category=${categoryId}`;
  }
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => data.furnitures)
    .catch(err => {
      console.error('Ошибка при загрузке мебели:', err);
      return [];
    });
}
// --- Рендер ---
function renderFurniture(items) {
  furnitureList = furnitureList.concat(items);
  const markup = items
    .map((item, index) => {
      const colors = item.color || ['#C7C3BB', '#C7AA80', '#201A19'];
      const colorsMarkup = `
        <div class="color-label-group">
          ${colors
            .map(
              (color, i) => `
                <label class="color-label">
                  <input type="radio" name="color-${index}" value="${color}" ${
                i === 0 ? 'checked' : ''
              } />
                  <span class="color-dot" style="background-color:${color}"></span>
                </label>
              `
            )
            .join('')}
        </div>
      `;
      return `
        <div class="price" data-index="${
          furnitureList.length - items.length + index
        }">
          <img class="price-image" src="${item.images[0]}" alt="${item.name}" />
          <h2 class="price-title">${item.name}</h2>
          ${colorsMarkup}
          <p class="price-price">${item.price} грн</p>
          <button class="my-button">Детальніше</button>
        </div>
      `;
    })
    .join('');
  container.insertAdjacentHTML('beforeend', markup);
}
// --- Кнопка "Показать ещё" ---
loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  // :small_blue_diamond: ЛОАДЕР: показываем
  showLoader();
  fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
    if (items.length === 0) {
      loadMoreBtn.style.display = 'none';
    }
    renderFurniture(items);
    // :small_blue_diamond: ЛОАДЕР: скрываем
    hideLoader();
  });
});
// --- Кнопка "Детальніше" ---
container.addEventListener('click', e => {
  const btn = e.target.closest('.my-button');
  if (!btn) return;
  const card = btn.closest('.price');
  const index = Number(card.dataset.index);
  if (!isNaN(index)) {
    const furnitureItem = furnitureList[index];
    if (furnitureItem) {
      openModal(furnitureItem);
    }
  }
});
// --- Начальная загрузка ---
showLoader();
fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
  renderFurniture(items);
  hideLoader();
});