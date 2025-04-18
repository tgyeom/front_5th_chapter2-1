/**
 * 제품별 대량 구매 할인율을 반환하는 함수
 * 10개 이상 구매 시 적용되는 할인율입니다.
 * @param productId 제품 ID
 */
export const getQuantityDiscountRate = (productId: string): number => {
  const discountRates: Record<string, number> = {
    p1: 0.1, // 10% 할인
    p2: 0.15, // 15% 할인
    p3: 0.2, // 20% 할인
    p4: 0.05, // 5% 할인
    p5: 0.25, // 25% 할인
  };

  // TypeScript 타입 안전성 보장
  return productId in discountRates ? discountRates[productId] : 0;
};
