var productSelect, addToCartButton, cartItemsDisplay, cartTotalDisplay, stockStatusDisplay;
var lastSelectedProduct, bonusPoints = 0, totalAmount = 0, itemCount = 0;

const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 }
];

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
  newItem.innerHTML = '<span>' + product.name + ' - ' + product.price + '원 x 1</span><div>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + product.id + '" data-change="-1">-</button>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + product.id + '" data-change="1">+</button>' +
    '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' + product.id + '">삭제</button></div>';
  return newItem;
}

function changeProductQuantity(product, change) {
  product.quantity -= change;
}

function addProductToCart(productId) {
  const product = getProductById(productId);

  if (!product || product.quantity <= 0) {
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
  var root = document.getElementById('app');
  let container = document.createElement('div');
  var wrapper = document.createElement('div');
  let headerText = document.createElement('h1');

  // createElement
  cartItemsDisplay = document.createElement('div');
  cartTotalDisplay = document.createElement('div');
  productSelect = document.createElement('select');
  addToCartButton = document.createElement('button');
  stockStatusDisplay = document.createElement('div');

  // ID 설정
  cartItemsDisplay.id = 'cart-items';
  cartTotalDisplay.id = 'cart-total';
  productSelect.id = 'product-select';
  addToCartButton.id = 'add-to-cart';
  stockStatusDisplay.id = 'stock-status';

  // 클래스 설정
  container.className = 'bg-gray-100 p-8';
  wrapper.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  headerText.className = 'text-2xl font-bold mb-4';
  cartTotalDisplay.className = 'text-xl font-bold my-4';
  productSelect.className = 'border rounded p-2 mr-2';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockStatusDisplay.className = 'text-sm text-gray-500 mt-2';

  // 텍스트
  headerText.textContent = '장바구니';
  addToCartButton.textContent = '추가';

  // 상품 목록 업데이트
  updateProductOptions();

  // appendChild
  wrapper.appendChild(headerText);
  wrapper.appendChild(cartItemsDisplay);
  wrapper.appendChild(cartTotalDisplay);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(stockStatusDisplay);
  container.appendChild(wrapper);
  root.appendChild(container);

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
      var luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
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
        var suggest = PRODUCT_LIST.find(function (item) {
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
  productSelect.innerHTML = '';
  PRODUCT_LIST.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    productSelect.appendChild(option);
  });
}

function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  var cartItems = cartItemsDisplay.children;
  var subtotal = 0;

  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var productId = cartItems[i].id;
      var currentItem = getProductById(productId);
      var quantity = getCartItemQuantity(cartItems[i]);
      var itemTotal = currentItem.price * quantity;
      var discount = 0;

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
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = subtotal - totalAmount;

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

  cartTotalDisplay.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalDisplay.appendChild(span);
  }

  updateStockStatus();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  var pointsTag = document.getElementById('loyalty-points');

  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    cartTotalDisplay.appendChild(pointsTag);
  }

  pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockStatus() {
  var infoMessage = '';
  PRODUCT_LIST.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage += item.name + ': ' + (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') + '\n';
    }
  });
  stockStatusDisplay.textContent = infoMessage;
}

// 어플리케이션 시작
main();