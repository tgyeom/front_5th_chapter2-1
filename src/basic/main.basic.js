import PRODUCT_LIST from './constants';
import { ProductOptions, CartTotal, Points, UIComponents } from './components';

var productSelect, addToCartButton, cartItemsDisplay, cartTotalDisplay, stockStatusDisplay;
var lastSelectedProduct, bonusPoints = 0, totalAmount = 0, itemCount = 0;

// 헬퍼 함수들
function getProductById(productId) {
  return PRODUCT_LIST.find(product => product.id === productId);
}

function getCartItemQuantity(itemElement) {
  return parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
}

function updateCartItemQuantity(itemElement, product, newQuantity) {
  itemElement.querySelector('span').textContent = product.name + ' - ' + product.price + '원 x ' + newQuantity;
}

function createCartItemElement(product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML = UIComponents.createCartItemUI(product);
  return newItem;
}

function changeProductQuantity(product, change) {
  product.quantity -= change;
}

function addProductToCart(productId) {
  const product = getProductById(productId);

  if (!product || product.quantity <= 0) {
    alert('재고가 부족합니다.');
    return false;
  }

  let itemElement = document.getElementById(product.id);

  if (itemElement) {
    const currentQuantity = getCartItemQuantity(itemElement);
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= product.quantity + currentQuantity) {
      updateCartItemQuantity(itemElement, product, newQuantity);
      changeProductQuantity(product, 1);
    } else {
      alert('재고가 부족합니다.');
      return false;
    }
  } else {
    const newItem = createCartItemElement(product);
    cartItemsDisplay.appendChild(newItem);
    changeProductQuantity(product, 1);
  }

  calculateCart();
  lastSelectedProduct = productId;
  return true;
}

function handleQuantityChange(productId, change) {
  const itemElement = document.getElementById(productId);
  const product = getProductById(productId);

  if (!itemElement || !product) {
    return false;
  }

  const currentQuantity = getCartItemQuantity(itemElement);
  const newQuantity = currentQuantity + change;

  if (newQuantity <= 0) {
    removeCartItem(productId);
    return true;
  }

  if (change > 0 && newQuantity > product.quantity + currentQuantity) {
    alert('재고가 부족합니다.');
    return false;
  }

  updateCartItemQuantity(itemElement, product, newQuantity);
  changeProductQuantity(product, change);
  calculateCart();
  return true;
}

function removeCartItem(productId) {
  const itemElement = document.getElementById(productId);
  const product = getProductById(productId);

  if (!itemElement || !product) {
    return false;
  }

  const quantity = getCartItemQuantity(itemElement);
  product.quantity += quantity;
  itemElement.remove();
  calculateCart();
  return true;
}

function initializeUI() {
  const root = document.getElementById('app');

  // 메인 UI 템플릿 생성
  const mainUI = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <div class="flex mb-4">
          <select id="product-select" class="border rounded p-2 mr-2">
            ${ProductOptions()}
          </select>
          <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        </div>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;

  // UI 렌더링
  root.innerHTML = mainUI;

  // DOM 요소 참조 설정
  cartItemsDisplay = document.getElementById('cart-items');
  cartTotalDisplay = document.getElementById('cart-total');
  productSelect = document.getElementById('product-select');
  addToCartButton = document.getElementById('add-to-cart');
  stockStatusDisplay = document.getElementById('stock-status');

  // 초기 장바구니 계산
  calculateCart();
}

function setupEventListeners() {
  addToCartButton.addEventListener('click', function () {
    addProductToCart(productSelect.value);
  });

  // 이벤트 위임
  cartItemsDisplay.addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('quantity-change')) {
      const productId = target.dataset.productId;
      const change = parseInt(target.dataset.change);
      handleQuantityChange(productId, change);
    } else if (target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      removeCartItem(productId);
    }
  });
}

function setupPromotions() {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        const suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSelectedProduct && item.quantity > 0;
        });

        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function main() {
  initializeUI();
  setupEventListeners();
  setupPromotions();
}

function updateProductOptions() {
  productSelect.innerHTML = ProductOptions();
}

function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartItemsDisplay.children;
  let subtotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      const productId = cartItems[i].id;
      const currentItem = getProductById(productId);
      const quantity = getCartItemQuantity(cartItems[i]);
      const itemTotal = currentItem.price * quantity;
      let discount = 0;

      itemCount += quantity;
      subtotal += itemTotal;

      // 수량 할인 적용
      if (quantity >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
      }

      totalAmount += itemTotal * (1 - discount);
    })();
  }

  // 대량 구매 할인 계산
  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subtotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subtotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subtotal - totalAmount) / subtotal;
    }
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  // 화요일 추가 할인
  if (new Date().getDay() === 2) {
    totalAmount *= (1 - 0.1);
    discountRate = Math.max(discountRate, 0.1);
  }

  // 카트 총액 UI 업데이트
  cartTotalDisplay.innerHTML = CartTotal(totalAmount, discountRate);

  updateStockStatus();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById('loyalty-points');

  if (!pointsTag) {
    cartTotalDisplay.innerHTML += Points(bonusPoints);
  } else {
    pointsTag.innerHTML = `(포인트: ${bonusPoints})`;
  }
};

function updateStockStatus() {
  stockStatusDisplay.innerHTML = UIComponents.createStockStatusUI();
}

main();