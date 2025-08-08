const furnitureItems = document.querySelectorAll('.card');
let categoryId = 'all'; // по умолчанию
const container = document.querySelector('.price-list');
const loadMoreBtn = document.getElementById('load-more-btn');

furnitureItems.forEach(item => {
  item.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return; // если клик не на карточке - игнор

    categoryId = card.dataset.category; // или card.id, если ты поставил атрибут id
    console.log('Клик по категории:', categoryId);

    currentPage = 1; // сбрасываем страницу при смене категории
    furnitureList = []; // очищаем старый список

    fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
      container.innerHTML = ''; // очищаем контейнер перед отрисовкой новых
      renderFurniture(items);
      loadMoreBtn.style.display = 'block'; // показываем кнопку при смене категории
    });
  });
});

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

let currentPage = 1;
const limit = 8;

function fetchFurniture(page = 1, limit = 8) {
  const url = `https://furniture-store.b.goit.study/api/furnitures?page=${page}&limit=${limit}`;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => data.furnitures)
    .catch(err => {
      console.error('Помилка при завантаженні меблів:', err);
      return [];
    });
}

// Ініціальне завантаження
fetchFurnitureByCategory(categoryId, currentPage, limit).then(renderFurniture);

// Обробник кнопки "Показати ще"
loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  fetchFurnitureByCategory(categoryId, currentPage, limit).then(items => {
    if (items.length === 0) {
      loadMoreBtn.style.display = 'none';
    }
    renderFurniture(items);
  });
});

import { openModal } from './furniture-detail.js';

let furnitureList = [];

function renderFurniture(items) {
  furnitureList = furnitureList.concat(items);

  const markup = items
    .map((item, index) => {
      const colors = item.colors || ['#c7c3bb', '#c7aa80', '#201a19'];

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

function renderColors(colors) {
  const container = modal.querySelector('.price');
  const title = `<p class="color-label-title">Колір</p>`;
  // чек бокс
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

// Бордова рамка навколо карток списку

let selectedCategory = null; // елемент з класом .selected

// Автоматически выделяем первую категорию "all"
const firstCategoryCard = Array.from(furnitureItems).find(
  card => card.dataset.category === 'all'
);

if (firstCategoryCard) {
  firstCategoryCard.classList.add('selected');
  selectedCategory = firstCategoryCard;
  categoryId = firstCategoryCard.dataset.category;
}

furnitureItems.forEach(card => {
  card.addEventListener('click', () => {
    // Зняти клас .selected з попередньої вибраної, якщо є
    if (selectedCategory) {
      selectedCategory.classList.remove('selected');
    }

    // Додати клас .selected до поточної
    card.classList.add('selected');
    selectedCategory = card;

    // Отримати id категорії
    const categoryId = card.dataset.category;
  });
});
