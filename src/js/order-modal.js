const orderModal = document.querySelector('[data-order-modal]');
const orderForm = orderModal.querySelector('.order-form');
const btnClose = orderModal.querySelector('[data-order-close]');

let currentFurnitureId = null;
let currentMarker = null;

function openOrderModal(furnitureId = '', marker = '') {
  currentFurnitureId = furnitureId;
  currentMarker = marker;

  orderModal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.add('is-hidden');
  document.body.style.overflow = 'auto';
  orderForm.reset();
}

// Закриття по кліку на бекдроп або кнопку закриття
orderModal.addEventListener('click', e => {
  if (e.target === orderModal || e.target.closest('[data-order-close]')) {
    closeOrderModal();
  }
});

// Закриття по ESC
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !orderModal.classList.contains('is-hidden')) {
    closeOrderModal();
  }
});

// ===== Валідація телефону =====
const phoneInput = orderForm.elements.phone; 
let errorMessage = phoneInput.nextElementSibling;
if (!errorMessage || !errorMessage.classList.contains('error-message')) {
  errorMessage = document.createElement('span');
  errorMessage.classList.add('error-message');
  phoneInput.insertAdjacentElement('afterend', errorMessage);
}

function formatPhone(value) {
  // Прибираємо все, крім цифр
  let digits = value.replace(/\D/g, '');

  // Якщо починається з 0, прибираємо його
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Якщо починається не з 38, додаємо 38
  if (!digits.startsWith('38')) {
    digits = '38' + digits;
  }

  // Тепер форматуємо у +38 XXX XXX XXXX
  if (digits.length > 2) {
    digits = '+' + digits.slice(0, 2) + ' ' +
             digits.slice(2, 5) + ' ' +
             digits.slice(5, 8) + ' ' +
             digits.slice(8, 12);
  } else {
    digits = '+' + digits;
  }
  return digits.trim();
}

function validatePhone() {
  // Форматуємо номер і встановлюємо в інпут
  phoneInput.value = formatPhone(phoneInput.value);

  // Перевіряємо чи відповідає формату +38 XXX XXX XXXX (загалом 13 цифр + + та пробіли)
  // Для валідації забираємо все крім цифр і перевіряємо довжину
  const digitsOnly = phoneInput.value.replace(/\D/g, '');

  if (digitsOnly.length === 12 && digitsOnly.startsWith('38')) {
    phoneInput.classList.remove('error');
    phoneInput.classList.add('valid');
    errorMessage.textContent = '';
    errorMessage.classList.remove('active');
    return true;
  } else {
    phoneInput.classList.add('error');
    phoneInput.classList.remove('valid');
    errorMessage.textContent = 'Error Text';
    errorMessage.classList.add('active');
    return false;
  }
}


// Перевірка при вводі та втраті фокусу
// Форматування номера під час вводу, без помилки
phoneInput.addEventListener('input', () => {
  // Просто форматування без валідації і без помилок
  phoneInput.value = formatPhone(phoneInput.value);
  phoneInput.classList.remove('error', 'valid');
  errorMessage.textContent = '';
  errorMessage.classList.remove('active');
});

// Валідація з показом помилки лише при втраті фокусу
phoneInput.addEventListener('blur', () => {
  const isValid = validatePhone();
  // validatePhone() вже показує/ховає помилку
});

// ===== Обробка відправки форми =====
orderForm.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validatePhone()) {
    return; // не відправляємо, якщо телефон невалідний
  }

  const formData = new FormData(orderForm);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    comment: formData.get('comment'),
    furnitureId: currentFurnitureId,
    marker: currentMarker,
  };

  try {
    const response = await fetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка сервера');
    }

    if (window.iziToast) {
      iziToast.success({
        title: 'Успіх',
        message: 'Заявка відправлена!',
      });
    } else {
      alert('Заявка відправлена!');
    }

    closeOrderModal();

  } catch (error) {
    if (window.iziToast) {
      iziToast.error({
        title: 'Помилка',
        message: error.message,
      });
    } else {
      alert('Помилка: ' + error.message);
    }
  }
});

export { openOrderModal, closeOrderModal };
