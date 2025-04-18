import { getQuantityDiscountRate } from "../services/discountService";

/**
 * 장바구니 상태 정보를 계산하는 유틸리티 함수
 */
export const cartCalculate = (
  cartItems: CartOrder.CartItem[],
  products: CartOrder.Product[],
  lastSelectedProduct: string | null
) => {
  if (cartItems.length === 0) {
    return {
      lastSelectedProduct,
      bonusPoints: 0,
      totalAmount: 0,
      itemCount: 0,
      discountRate: 0,
      isTuesdayDiscount: false,
    };
  }

  let totalAmount = 0;
  let itemCount = 0;
  let subtotal = 0;

  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const quantity = item.quantity;
    const itemPrice = product.price * quantity;

    itemCount += quantity;
    subtotal += itemPrice;

    let discount = quantity >= 10 ? getQuantityDiscountRate(item.productId) : 0;
    totalAmount += itemPrice * (1 - discount);
  });

  if (itemCount >= 30) {
    const bulkDiscount = subtotal * 0.25;
    const itemDiscount = subtotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subtotal * 0.75;
    }
  }

  // 화요일 할인 적용
  let isTuesdayDiscount = false;
  if (new Date().getDay() === 2) {
    isTuesdayDiscount = true;
    totalAmount *= 0.9;
  }

  const discountRate = subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0;
  const bonusPoints = Math.floor(totalAmount / 1000);

  return {
    lastSelectedProduct,
    bonusPoints,
    totalAmount,
    itemCount,
    discountRate,
    isTuesdayDiscount,
  };
};
