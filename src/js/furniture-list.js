const furnitureItems = document.querySelectorAll('.card');
furnitureItems.forEach(item => {
  item.addEventListener('click', () => {
    console.log('Клик по мебели');
  });
});

const container = document.querySelector('.price-list');
const loadMoreBtn = document.getElementById('load-more-btn');

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

// function renderFurniture(items) {
//   const markup = items
//     .map(
//       item => `
//       <div class="price">
//         <img class="price-image" src="${item.images[0]}" alt="${item.name}" />
//         <h2 class="price-title">${item.name}</h2>
//         <p class="price-price">${item.price} грн</p>
//         <button class="my-button">Детальніше</button>
//       </div>
//     `
//     )
//     .join('');

//   container.insertAdjacentHTML('beforeend', markup);
// }

// Ініціальне завантаження
fetchFurniture(currentPage, limit).then(renderFurniture);

// Обробник кнопки "Показати ще"
loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  fetchFurniture(currentPage, limit).then(items => {
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
