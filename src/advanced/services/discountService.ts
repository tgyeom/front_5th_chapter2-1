import { DISCOUNT_RATES } from "../constants";

// 제품별 대량 구매 할인율을 반환하는 함수
export const getQuantityDiscountRate = (productId: string): number => {
  return productId in DISCOUNT_RATES ? DISCOUNT_RATES[productId] : 0;
};
