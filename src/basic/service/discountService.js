// 제품별 대량 구매 할인율 반환
export const getQuantityDiscountRate = (productId) => {
    const discountRates = {
        'p1': 0.1,
        'p2': 0.15,
        'p3': 0.2,
        'p4': 0.05,
        'p5': 0.25
    };

    return discountRates[productId] || 0;
};
