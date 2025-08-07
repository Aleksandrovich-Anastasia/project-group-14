import axios from 'axios';

const BASE_URL = 'https://furniture-store.b.goit.study/api';

async function fetchFurniture({ page = 1, limit = 8 }) {
  try {
    const params = {
      page,
      limit,
    };
    const response = await axios.get(`${BASE_URL}/furniture`, { params });
    return response.data;
  } catch (error) {
    console.error('Помилка завантаження меблів:', error);
    throw error;
  }
}

async function renderFurniture() {
  try {
    const data = await fetchFurniture({ page: 1, limit: 8 });

    const furnitureMarkup = data.furniture
      .map(
        item => `
        <li class="furniture-card">
          <div class="card-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="card-content">
            <h3 class="card-title">${item.name}</h3>
            <p class="card-color">Колір: ${item.color}</p>
            <p class="card-price">${item.price} ₴</p>
            <button class="details-btn">Детальніше</button>
          </div>
        </li>
      `
      )
      .join('');

    document.querySelector('.furniture-list').innerHTML = furnitureMarkup;
  } catch (error) {
    console.error('Помилка рендерингу меблів:', error);
  }
}

renderFurniture();
