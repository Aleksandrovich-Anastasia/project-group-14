const slider = document.querySelector('.reviews-slider');
const cards = document.querySelectorAll('.review-card');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

// Створюємо точки
const dotsContainer = document.createElement('div');
dotsContainer.classList.add('slider-dots');
document.querySelector('.reviews .container').appendChild(dotsContainer);

cards.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateSlider();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateSlider();
});

// Автоматична прокрутка
setInterval(() => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateSlider();
}, 5000);
