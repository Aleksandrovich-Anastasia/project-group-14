import Raty from 'raty-js';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { api } from '../api/api.js';
import starOn from '../img/star-full.svg';
import starOff from '../img/star-empty.svg';
import starHalf from '../img/star-half.svg';

function roundRating(value) {
  if (value >= 3.3 && value <= 3.7) return 3.5;
  if (value >= 3.8 && value <= 4.2) return 4;
  return Math.round(value * 2) / 2;
}

export async function initFeedback() {
  const list = document.querySelector('.feedback-list');
  if (!list) return;

  try {
    // 
    const { data } = await api.get('/feedbacks', {
  params: {
    limit: 10,
    page: 1,
  },
});
    
    
    const items = Array.isArray(data.feedbacks) ? data.feedbacks.slice(0, 10) : [];
  

    const markup = items
       .map(item => {
    const rating = roundRating(item.rate ?? 0);  // <-- заменили rating → rate
    const text = item.descr || '';               // <-- заменили comment → descr
    const user = item.name || 'Анонім';          // <-- name — уже подходит
    return `
          <li class="feedback-item swiper-slide">
            <div class="feedback-rating" data-score="${rating}"></div>
            <p class="feedback-text text">${text}</p>
            <p class="feedback-user">${user}</p>         
          </li>
        `;
      })
      .join('');

    list.innerHTML = markup;

    list.querySelectorAll('.feedback-rating').forEach(el => {
      const score = parseFloat(el.dataset.score);
      const raty = new Raty(el, {
        readOnly: true,
        score,
        starOn,
        starOff,
        starHalf,
        half: true,
      });
      raty.init();
    });

        new Swiper('.feedback-swiper', {
  modules: [Navigation, Pagination],
  navigation: {
    nextEl: '.feedback-next',
    prevEl: '.feedback-prev',
  },
  pagination: {
    el: '.feedback-pagination-list',
    clickable: true,
    bulletClass: 'feedback-pagination-item',
    bulletActiveClass: 'is-active',
    renderBullet: (index, className) => `<li class="${className}"></li>`,
  },
  spaceBetween: 24, // відстань між картками
  breakpoints: {
    0: {          // мобільні
      slidesPerView: 1,
    },
    768: {        // планшети
      slidesPerView: 2,
    },
    1440: {       // десктопи
      slidesPerView: 3,
    },
  },
});



  } catch (err) {
    console.error('Failed to load feedbacks', err);
  }
}
const navButtons = document.querySelectorAll('.feedback-btn');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  });
});
initFeedback();


