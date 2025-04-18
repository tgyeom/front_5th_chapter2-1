const handleAddToCartClick = (productSelectEl, addToCart) => () => {
    const selectedId = productSelectEl.value;
    addToCart(selectedId);
};

const handleCartItemsClick = (event, updateQuantity, removeCartItem) => {
    const target = event.target;

    if (target.classList.contains('quantity-change')) {
        const productId = target.dataset.productId;
        const change = parseInt(target.dataset.change);
        updateQuantity(productId, change);
    } else if (target.classList.contains('remove-item')) {
        const productId = target.dataset.productId;
        removeCartItem(productId);
    }
};

export { handleAddToCartClick, handleCartItemsClick };