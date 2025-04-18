interface CartSummary {
  totalAmount: number;
  itemCount: number;
  subtotal: number;
  discountRate: number;
  isTuesdayDiscount: boolean;
  bonusPoints: number;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export const calculateCartSummary = (
  cartItems: CartItem[],
  products: CartOrder.Product[]
): CartSummary => {
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

    // 대량 구매 할인 적용 (10개 이상 구매시)
    const getQuantityDiscountRate = (productId: string) => {
      const discountRates: Record<string, number> = {
        p1: 0.1,
        p2: 0.15,
        p3: 0.2,
        p4: 0.05,
        p5: 0.25,
      };

      return productId in discountRates ? discountRates[productId] : 0;
    };

    let discount = quantity >= 10 ? getQuantityDiscountRate(item.productId) : 0;
    totalAmount += itemPrice * (1 - discount);
  });

  // 30개 이상 구매시 대량 할인 적용
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
    totalAmount,
    itemCount,
    subtotal,
    discountRate,
    isTuesdayDiscount,
    bonusPoints,
  };
};
