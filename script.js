// Variables para almacenar los elementos del DOM
const currencySelect = document.getElementById('currency-select');
const amountInput = document.getElementById('amount-input');
const cryptoSelect = document.getElementById('crypto-select');
const currentPrice = document.getElementById('current-price');
const highestPrice = document.getElementById('highest-price');
const lowestPrice = document.getElementById('lowest-price');
const launchPrice = document.getElementById('launch-price');
const priceDifference = document.getElementById('price-difference');
const quantityInput = document.getElementById('quantity-input');
const totalCost = document.getElementById('total-cost');

// Función para obtener los precios de la API
function getPrices() {
  const currency = currencySelect.value;
  const crypto = cryptoSelect.value;

  axios
    .get(`https://api.coincap.io/v2/assets/${crypto}/history?interval=d1`)
    .then((response) => {
      const data = response.data.data;
      const current = data[data.length - 1];
      const highest = Math.max(...data.map((item) => item.priceUsd));
      const lowest = Math.min(...data.map((item) => item.priceUsd));
      const launch = data[0].priceUsd;
      const difference = current.priceUsd - data[data.length - 2].priceUsd;

      currentPrice.textContent = `$${current.priceUsd}`;
      highestPrice.textContent = `$${highest}`;
      lowestPrice.textContent = `$${lowest}`;
      launchPrice.textContent = `$${launch}`;
      priceDifference.textContent = `$${difference.toFixed(2)}`;

      calculateQuantity();
    })
    .catch((error) => {
      console.log(error);
    });
}

// Función para calcular la cantidad de criptomoneda que se puede comprar
function calculateQuantity() {
  const amount = parseFloat(amountInput.value);
  const currentPriceValue = parseFloat(currentPrice.textContent.replace('$', ''));
  const quantity = amount / currentPriceValue;

  quantityInput.value = quantity.toFixed(6);
  calculateTotalCost();
}

// Función para calcular el costo total de la compra
function calculateTotalCost() {
  const quantity = parseFloat(quantityInput.value);
  const currentPriceValue = parseFloat(currentPrice.textContent.replace('$', ''));
  const total = quantity * currentPriceValue;

  totalCost.value = `$${total.toFixed(2)}`;
}

// Event listeners
currencySelect.addEventListener('change', getPrices);
amountInput.addEventListener('input', calculateQuantity);
cryptoSelect.addEventListener('change', getPrices);

// Obtener precios al cargar la página
window.addEventListener('load', getPrices);
