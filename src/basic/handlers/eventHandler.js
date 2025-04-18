import { CLASS } from '../constants';

const handleAddToCartClick = (productSelectEl, addToCart) => () => {
    const selectedId = productSelectEl.value;
    addToCart(selectedId);
};

const handleCartItemsClick = (event, updateQuantity, removeCartItem) => {
    const target = event.target;

    if (target.classList.contains(CLASS.quantityChange)) {
        const productId = target.dataset.productId;
        const change = parseInt(target.dataset.change);
        updateQuantity(productId, change);
    } else if (target.classList.contains(CLASS.removeItem)) {
        const productId = target.dataset.productId;
        removeCartItem(productId);
    }
};

export { handleAddToCartClick, handleCartItemsClick };