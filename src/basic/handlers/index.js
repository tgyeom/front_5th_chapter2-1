import { getProductById } from '../utils';
import { CartItem } from '../components';

const getCartItemQuantity = (element) => {
    return parseInt(element.querySelector('span').textContent.split('x ')[1]);
}

const updateCartItemQuantity = (itemElement, product, newQuantity) => {
    itemElement.querySelector('span').textContent = product.name + ' - ' + product.price + '원 x ' + newQuantity;
}

const createCartItemElement = (product) => {
    const newItem = document.createElement('div');
    newItem.id = product.id;
    newItem.className = 'flex justify-between items-center mb-2';
    newItem.innerHTML = CartItem(product);
    return newItem;
}

const changeProductQuantity = (product, change) => {
    product.quantity -= change;
}

const addProductToCart = (productId) => {
    const product = getProductById(productId);

    if (!product || product.quantity <= 0) {
        alert('재고가 부족합니다.');
        return false;
    }

    let itemElement = document.getElementById(product.id);

    if (itemElement) {
        const currentQuantity = getCartItemQuantity(itemElement);
        const newQuantity = currentQuantity + 1;

        if (newQuantity <= product.quantity + currentQuantity) {
            updateCartItemQuantity(itemElement, product, newQuantity);
            changeProductQuantity(product, 1);
        } else {
            alert('재고가 부족합니다.');
            return false;
        }
    } else {
        const newItem = createCartItemElement(product);
        cartItemsDisplay.appendChild(newItem);
        changeProductQuantity(product, 1);
    }

    calculateCart();
    lastSelectedProduct = productId;
    return true;
}

const handleQuantityChange = (productId, change) => {
    const itemElement = document.getElementById(productId);
    const product = getProductById(productId);

    if (!itemElement || !product) {
        return false;
    }

    const currentQuantity = getCartItemQuantity(itemElement);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
        removeCartItem(productId);
        return true;
    }

    if (change > 0 && newQuantity > product.quantity + currentQuantity) {
        alert('재고가 부족합니다.');
        return false;
    }

    updateCartItemQuantity(itemElement, product, newQuantity);
    changeProductQuantity(product, change);
    calculateCart();
    return true;
}

const removeCartItem = (productId) => {
    const itemElement = document.getElementById(productId);
    const product = getProductById(productId);

    if (!itemElement || !product) {
        return false;
    }

    const quantity = getCartItemQuantity(itemElement);
    product.quantity += quantity;
    itemElement.remove();
    calculateCart();
    return true;
}

export {
    getProductById,
    getCartItemQuantity,
    updateCartItemQuantity,
    createCartItemElement,
    changeProductQuantity,
    addProductToCart,
    handleQuantityChange,
    removeCartItem
}