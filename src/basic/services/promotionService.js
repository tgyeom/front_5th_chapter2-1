const lightningSale = (products, updateProductOptions) => {
    const randomProductIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomProductIndex];

    if (Math.random() < 0.3 && randomProduct.quantity > 0) {
        randomProduct.price = Math.round(randomProduct.price * 0.8);
        alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
        updateProductOptions();
    }
};

const suggestedPromotion = (products, lastSelectedProduct, updateProductOptions) => {
    const suggestedProduct = products.find(
        product => product.id !== lastSelectedProduct && product.quantity > 0
    );

    if (suggestedProduct) {
        suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
        alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        updateProductOptions();
    }
};

export { lightningSale, suggestedPromotion };