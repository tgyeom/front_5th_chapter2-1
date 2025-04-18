/**
 * 랜덤한 제품을 선택하여 할인 이벤트를 적용하는 서비스
 * @param products 제품 목록
 * @param updateCallback 업데이트 후 호출할 콜백 함수
 */
const lightningSale = (
  products: CartOrder.Product[],
  updateCallback: () => void
): void => {
  const randomProductIndex = Math.floor(Math.random() * products.length);
  const randomProduct = products[randomProductIndex];

  if (Math.random() < 0.3 && randomProduct.quantity > 0) {
    // 30% 확률로 번개세일 발생하고 재고가 있는 경우
    randomProduct.price = Math.round(randomProduct.price * 0.8); // 20% 할인
    alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
    updateCallback();
  }
};

/**
 * 마지막으로 선택한 상품 외에 다른 상품을 추천하는 서비스
 * @param products 제품 목록
 * @param lastSelectedProduct 마지막으로 선택한 상품 ID
 * @param updateCallback 업데이트 후 호출할 콜백 함수
 */
const suggestedPromotion = (
  products: CartOrder.Product[],
  lastSelectedProduct: string,
  updateCallback: () => void
): void => {
  // 마지막 선택 상품이 아니면서 재고가 있는 상품 찾기
  const suggestedProduct = products.find(
    (product) => product.id !== lastSelectedProduct && product.quantity > 0
  );

  if (suggestedProduct) {
    // 추천 제품 5% 할인
    suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
    alert(
      `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
    );
    updateCallback();
  }
};

export { lightningSale, suggestedPromotion };
