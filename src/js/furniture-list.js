const furnitureItems = document.querySelectorAll('.card');
furnitureItems.forEach(item => {
  item.addEventListener('click', () => {
    console.log('Клик по мебели');
  });
});

// const container = document.querySelector('.price-list');

// fetch('https://furniture-store.b.goit.study/api/furnitures?limit=8')
//   .then(res => res.json())
//   .then(data => {
//     const markup = data.furnitures
//       .map(
//         item => `
//       <div class="price">
//         <img class="price-image" src="${item.images[0]}" alt="${item.name}" />
//         <h2 class="price-title">${item.name}</h2>
//         <p class="price-price">${item.price} грн</p>
//         <button class="my-button">Детальніше</button>
//       </div>
//     `
//       )
//       .join('');

//     container.innerHTML = markup;
//   })
//   .catch(err => console.error('Помилка при завантаженні меблів:', err));

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

function renderFurniture(items) {
  const markup = items
    .map(
      item => `
      <div class="price">
        <img class="price-image" src="${item.images[0]}" alt="${item.name}" />
        <h2 class="price-title">${item.name}</h2>
        <p class="price-price">${item.price} грн</p>
        <button class="my-button">Детальніше</button>
      </div>
    `
    )
    .join('');

  container.insertAdjacentHTML('beforeend', markup);
}

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
