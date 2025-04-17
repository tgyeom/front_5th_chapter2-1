// DOM 요소에 대한 참조를 반환하는 함수
const CREATE_ELEMENT = () => {
    return {
        cartItemsDisplay: document.getElementById('cart-items'),
        cartTotalDisplay: document.getElementById('cart-total'),
        productSelect: document.getElementById('product-select'),
        addToCartButton: document.getElementById('add-to-cart'),
        stockStatusDisplay: document.getElementById('stock-status')
    };
};

export default CREATE_ELEMENT;