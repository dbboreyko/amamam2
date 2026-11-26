'use strict';
/**
 * Місія 05 — учнівський файл. Це НЕ готове рішення.
 * Місія 04 (фільтри) вже працює у js/app.js.
 * TODO-A: зв'язок картки страви з формою (частково підготовлений).
 * TODO-Б: самостійна перевірка кількості; без готового розв'язку.
 * TODO-В: валідація, підсумок і стани форми.
 */
const orderForm = document.getElementById('orderForm');
const selectedDishInput = document.getElementById('selectedDish');
const orderPrice = document.getElementById('orderPrice');
const orderSummary = document.getElementById('orderSummary');
const fieldErrorIds = {
    studentName: 'nameError',
    studentClass: 'classError',
    selectedDish: 'dishError',
    quantity: 'quantityError'
};
let selectedDish = null;
function isValidQuantity(value) {
    // ОБОВ'ЯЗКОВО САМОСТІЙНО: порожнє значення, ціле число, межі 1–5.
    // Підказка: Number.isInteger() перевіряє цілі числа.
    // TODO: замініть цей навчальний результат власною реалізацією.
    return false;
}
function selectDish(dish) {
    // Інкремент А: кнопка вже передає сюди об'єкт страви.
    // TODO: збережіть dish, відобразіть назву, оновіть вартість.
    selectedDish = dish;
    selectedDishInput.value = dish.name;
    orderPrice.textContent = `Ціна за порцію: ${dish.price} грн`;
    setFieldError('selectedDish', '');
    orderSummary.hidden = true;
    document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldErrorIds[fieldId]);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
}
function validateOrder() {
    const studentName = document.getElementById('studentName').value.trim();
    const classInput = document.getElementById('studentClass');
    const hasValidClass = Array.from(classInput.options).some(option =>
        option.value !== '' && option.value === classInput.value);
    const hasValidDish = Boolean(selectedDish &&
        typeof selectedDish.name === 'string' &&
        selectedDish.name.trim() !== '' &&
        Number.isFinite(selectedDish.price) &&
        selectedDish.price >= 0);
    const quantity = document.getElementById('quantity').value;

    setFieldError('studentName', studentName.length >= 2 ? '' : 'Введіть ім’я щонайменше з 2 символів.');
    setFieldError('studentClass', hasValidClass ? '' : 'Оберіть клас зі списку.');
    setFieldError('selectedDish', hasValidDish ? '' : 'Оберіть страву в меню.');
    setFieldError('quantity', isValidQuantity(quantity) ? '' : 'Вкажіть цілу кількість від 1 до 5.');

    return studentName.length >= 2 &&
        hasValidClass &&
        hasValidDish &&
        isValidQuantity(quantity);
}
function calculateTotal() {
    const quantity = document.getElementById('quantity').value;
    if (!selectedDish || !isValidQuantity(quantity))
        return null;
    return selectedDish.price * Number(quantity);
}
function resetConfirmation(event) {
    orderSummary.hidden = true;
    const fieldId = event.target.id;
    if (Object.prototype.hasOwnProperty.call(fieldErrorIds, fieldId))
        setFieldError(fieldId, '');
}
orderForm.addEventListener('input', resetConfirmation);
orderForm.addEventListener('change', resetConfirmation);
orderForm.addEventListener('submit', event => {
    event.preventDefault();
    orderSummary.hidden = true;
    if (!validateOrder())
        return;
    const total = calculateTotal();
    if (total === null)
        return;

    const studentName = document.getElementById('studentName').value.trim();
    const studentClass = document.getElementById('studentClass').value;
    const quantity = Number(document.getElementById('quantity').value);
    const comment = document.getElementById('comment').value.trim();
    const summaryLines = [
        'Дані перевірено. Навчальне замовлення сформовано. Замовлення не надіслано.',
        `Учень: ${studentName}; клас: ${studentClass}; страва: ${selectedDish.name}; кількість: ${quantity}; разом: ${total} грн.`
    ];
    if (comment)
        summaryLines.push(`Коментар: ${comment}`);
    orderSummary.textContent = summaryLines.join(' ');
    orderSummary.hidden = false;
});
window.CanteenOrder = { selectDish, isValidQuantity };
