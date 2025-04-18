import PRODUCT_LIST from './constants';
import { handleAddToCartClick, handleCartItemsClick } from './handler/eventHandler';
import { lightningSale, suggestedPromotion } from './service/promotionService';
import { ProductOptions, CartTotal, Points, UIComponents } from './components';

// 전역 상태 변수들
let products = [...PRODUCT_LIST]; // 제품 목록 복사본
let lastSelectedProduct = null;
let bonusPoints = 0;
let totalAmount = 0;
let itemCount = 0;

// DOM 엘리먼트 참조
let cartItemsEl;
let cartTotalEl;
let productSelectEl;
let addToCartBtnEl;
let stockStatusEl;

// 초기화 및 메인 함수
const initApp = () => {
  renderMainUI();
  setupDomElements();
  setupEventListeners();
  setupPromotions();
  updateCartDisplay();
}

// 메인 UI 렌더링
const renderMainUI = () => {
  const appRoot = document.getElementById('app');
  appRoot.innerHTML = `
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
}

// DOM 엘리먼트 연결
const setupDomElements = () => {
  cartItemsEl = document.getElementById('cart-items');
  cartTotalEl = document.getElementById('cart-total');
  productSelectEl = document.getElementById('product-select');
  addToCartBtnEl = document.getElementById('add-to-cart');
  stockStatusEl = document.getElementById('stock-status');
}

const setupEventListeners = () => {
  addToCartBtnEl.addEventListener('click', handleAddToCartClick(productSelectEl, addToCart));

  cartItemsEl.addEventListener('click', (event) =>
    handleCartItemsClick(event, updateQuantity, removeCartItem)
  );
};

// 제품 ID로 제품 찾기
const findProduct = (productId) => {
  return products.find(product => product.id === productId);
}

// 장바구니에 제품 추가
const addToCart = (productId) => {
  const product = findProduct(productId);

  // 재고 확인
  if (!product || product.quantity <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  // 기존 항목이 있는지 확인
  const existingItemEl = document.getElementById(productId);

  if (existingItemEl) {
    // 이미 장바구니에 있는 경우 수량 증가
    updateQuantity(productId, 1);
  } else {
    // 새 항목 추가
    const newItemEl = createCartItemElement(product);
    cartItemsEl.appendChild(newItemEl);

    // 장바구니 상태 업데이트
    product.quantity--;
  }

  // 마지막 선택 제품 기록 (추천용)
  lastSelectedProduct = productId;

  // 장바구니 다시 계산
  updateCartDisplay();
}

// 장바구니 항목 요소 생성
const createCartItemElement = (product) => {
  const itemEl = document.createElement('div');
  itemEl.id = product.id;
  itemEl.className = 'flex justify-between items-center mb-2';
  itemEl.innerHTML = UIComponents.createCartItemUI(product);
  return itemEl;
}

// 항목 수량 변경
const updateQuantity = (productId, change) => {
  const itemEl = document.getElementById(productId);
  const product = findProduct(productId);

  if (!itemEl || !product) {
    return;
  }

  // 현재 수량 가져오기
  const currentQuantity = getItemQuantity(itemEl);
  const newQuantity = currentQuantity + change;

  // 수량이 0이하면 항목 제거
  if (newQuantity <= 0) {
    removeCartItem(productId);
    return;
  }

  if (change > 0 && product.quantity <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  // 항목 수량 및 재고 업데이트
  updateItemQuantityDisplay(itemEl, product, newQuantity);
  product.quantity -= change;

  // 장바구니 다시 계산
  updateCartDisplay();
}

// 항목 수량 가져오기
const getItemQuantity = (itemEl) => {
  return parseInt(itemEl.querySelector('span').textContent.split('x ')[1]);
}

// 항목 수량 표시 업데이트
const updateItemQuantityDisplay = (itemEl, product, quantity) => {
  itemEl.querySelector('span').textContent = `${product.name} - ${product.price}원 x ${quantity}`;
}

// 항목 제거
const removeCartItem = (productId) => {
  const itemEl = document.getElementById(productId);
  const product = findProduct(productId);

  if (!itemEl || !product) {
    return;
  }

  // 재고 복원
  const quantity = getItemQuantity(itemEl);
  product.quantity += quantity;

  // DOM에서 항목 제거
  itemEl.remove();

  // 장바구니 다시 계산
  updateCartDisplay();
}

// 장바구니 계산 및 화면 업데이트
const updateCartDisplay = () => {
  // 기본 변수 초기화
  totalAmount = 0;
  itemCount = 0;
  let subtotal = 0;

  // 장바구니 항목 순회
  const cartItems = cartItemsEl.children;
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const productId = item.id;
    const product = findProduct(productId);
    const quantity = getItemQuantity(item);
    const itemPrice = product.price * quantity;

    itemCount += quantity;
    subtotal += itemPrice;

    // 수량 할인 적용
    let discount = 0;
    if (quantity >= 10) {
      // 제품별 대량 구매 할인율
      discount = getQuantityDiscountRate(productId);
    }

    // 할인 적용된 가격 합산
    totalAmount += itemPrice * (1 - discount);
  }

  // 대량 구매 할인 (30개 이상 구매 시)
  if (itemCount >= 30) {
    const bulkDiscount = subtotal * 0.25; // 25% 할인
    const itemDiscount = subtotal - totalAmount; // 이미 적용된 할인

    // 더 많은 할인을 제공하는 옵션 선택
    if (bulkDiscount > itemDiscount) {
      totalAmount = subtotal * (1 - 0.25);
    }
  }

  // 할인율 계산
  const discountRate = subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0;
  let finalDiscountRate = discountRate;
  let isTuesdayDiscount = false;

  // 화요일 할인 (10%)
  if (new Date().getDay() === 2) {
    isTuesdayDiscount = true;
    totalAmount *= (1 - 0.1);
  }

  // 포인트 계산
  bonusPoints = Math.floor(totalAmount / 1000);

  // UI 업데이트
  updateCartTotalDisplay(finalDiscountRate, isTuesdayDiscount);
  updateStockStatusDisplay();
}

// 제품별 대량 구매 할인율 반환
const getQuantityDiscountRate = (productId) => {
  const discountRates = {
    'p1': 0.1,  // 10%
    'p2': 0.15, // 15%
    'p3': 0.2,  // 20%
    'p4': 0.05, // 5%
    'p5': 0.25  // 25%
  };

  return discountRates[productId] || 0;
}

// 장바구니 총액 표시 업데이트
const updateCartTotalDisplay = (discountRate, isTuesdayDiscount) => {
  // 총액 정보 업데이트
  if (isTuesdayDiscount) {
    cartTotalEl.innerHTML = `총액: ${Math.round(totalAmount)}원<span class="text-green-500 ml-2">(10.0% 할인 적용)</span>`;
  } else {
    cartTotalEl.innerHTML = CartTotal(totalAmount, discountRate);
  }

  // 포인트 정보 추가
  let pointsEl = document.getElementById('loyalty-points');
  if (!pointsEl) {
    cartTotalEl.innerHTML += Points(bonusPoints);
  } else {
    pointsEl.innerHTML = `(포인트: ${bonusPoints})`;
  }
}

// 재고 상태 표시 업데이트
const updateStockStatusDisplay = () => {
  stockStatusEl.innerHTML = UIComponents.createStockStatusUI();
}

// 프로모션 설정
const setupPromotions = () => {
  setTimeout(() => {
    setInterval(() => {
      lightningSale(products, updateProductOptions);
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProduct) {
        suggestedPromotion(products, lastSelectedProduct, updateProductOptions);
      }
    }, 60000);
  }, Math.random() * 20000);
};

// 제품 선택 옵션 업데이트
const updateProductOptions = () => {
  productSelectEl.innerHTML = ProductOptions();
}

initApp();