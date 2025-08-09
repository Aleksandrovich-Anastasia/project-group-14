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

function closeOrderModal(resetForm = false) {
  orderModal.classList.add('is-hidden');
  document.body.style.overflow = 'auto';
  if (resetForm) orderForm.reset();
}

// Закриття по кліку на бекдроп або кнопку
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

// ===== Валідація =====
const phoneInput = orderForm.elements.phone;
const nameInput = orderForm.elements.name;
let errorMessagePhone = createErrorMessage(phoneInput);
let errorMessageName = createErrorMessage(nameInput);

function createErrorMessage(input) {
  let span = input.nextElementSibling;
  if (!span || !span.classList.contains('error-message')) {
    span = document.createElement('span');
    span.classList.add('error-message');
    input.insertAdjacentElement('afterend', span);
  }
  return span;
}

function formatPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (!digits.startsWith('38')) digits = '38' + digits;
  return digits.length > 2
    ? '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5, 8) + ' ' + digits.slice(8, 12)
    : '+' + digits;
}

function validatePhone() {
  phoneInput.value = formatPhone(phoneInput.value);
  const digitsOnly = phoneInput.value.replace(/\D/g, '');
  if (digitsOnly.length === 12 && digitsOnly.startsWith('38')) {
    phoneInput.classList.remove('error');
    errorMessagePhone.textContent = '';
    return true;
  } else {
    phoneInput.classList.add('error');
    errorMessagePhone.textContent = 'Невірний номер телефону';
    return false;
  }
}

function validateName() {
  const value = nameInput.value.trim();
  if (value.length >= 2) {
    nameInput.classList.remove('error');
    errorMessageName.textContent = '';
    return true;
  } else {
    nameInput.classList.add('error');
    errorMessageName.textContent = 'Введіть ім’я (мінімум 2 символи)';
    return false;
  }
}

// Live форматування
phoneInput.addEventListener('input', () => {
  phoneInput.value = formatPhone(phoneInput.value);
  phoneInput.classList.remove('error');
  errorMessagePhone.textContent = '';
});

// ===== Сабміт =====
orderForm.addEventListener('submit', async e => {
  e.preventDefault();

  const isValid = validateName() & validatePhone(); 
  if (!isValid) return;

  const formData = new FormData(orderForm);
  const data = {
    name: formData.get('name').trim(),
    phone: formData.get('phone').trim(),
    comment: formData.get('comment')?.trim(),
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

    iziToast.success({ title: 'Успіх', message: 'Заявка відправлена!' });
    closeOrderModal(true); 

  } catch (error) {
    iziToast.error({ title: 'Помилка', message: error.message });
  }
});

export { openOrderModal, closeOrderModal };
