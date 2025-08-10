import { openModal } from './furniture-detail.js';

const furnitureItems = document.querySelectorAll('.card[data-category-id]');
const container = document.querySelector('.price-list');
const loadMoreBtn = document.getElementById('load-more-btn');

let categoryId = 'all'; // поточна категорія
let currentPage = 1;
const limit = 8;
let furnitureList = [];
let selectedCategory = null; // для підсвітки активної категорії

// --- Виділення першої категорії "all" ---
const firstCategoryCard = Array.from(furnitureItems).find(
  card => card.dataset.categoryId === 'all'
);
if (firstCategoryCard) {
  firstCategoryCard.classList.add('selected');
  selectedCategory = firstCategoryCard;
  categoryId = firstCategoryCard.dataset.categoryId;
}

// --- Обробка кліку на категорію ---
furnitureItems.forEach(card => {
  card.addEventListener('click', e => {
    const clickedCard = e.target.closest('.card');
    if (!clickedCard) return;

    // Підсвітка
    if (selectedCategory) {
      selectedCategory.classList.remove('selected');
    }
    clickedCard.classList.add('selected');
    selectedCategory = clickedCard;

    // Зміна категорії
    categoryId = clickedCard.dataset.categoryId;
    console.log('Клік по категорії:', categoryId);

    // Скидаємо дані
    currentPage = 1;
    furnitureList = [];

    // Завантажуємо нові товари
    fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
      container.innerHTML = '';
      renderFurniture(items);
      loadMoreBtn.style.display = items.length < limit ? 'none' : 'block';
    });
  });
});

// --- Запит меблів з категорією ---
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
      console.error('Помилка при завантаженні меблів за категорією:', err);
      return [];
    });
}

// --- Рендер ---
function renderFurniture(items) {
  furnitureList = furnitureList.concat(items);

  const markup = items
    .map((item, index) => {
      const colors = item.color || ['#c7c3bb', '#c7aa80', '#201a19'];

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

// --- Подія на кнопку "Показати ще" ---
loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
    if (items.length === 0) {
      loadMoreBtn.style.display = 'none';
    }
    renderFurniture(items);
  });
});

// --- Обробка кліку на кнопку "Детальніше" ---
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

// --- Початкове завантаження ---
fetchFurnitureByCategory(categoryId, currentPage, limit).then(renderFurniture);
