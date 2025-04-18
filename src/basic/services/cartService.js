export const calculateCartSummary = (cartItems, findProduct, getItemQuantity, getQuantityDiscountRate) => {
    let totalAmount = 0;
    let itemCount = 0;
    let subtotal = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const productId = item.id;
        const product = findProduct(productId);
        const quantity = getItemQuantity(item);
        const itemPrice = product.price * quantity;

        itemCount += quantity;
        subtotal += itemPrice;

        let discount = quantity >= 10 ? getQuantityDiscountRate(productId) : 0;
        totalAmount += itemPrice * (1 - discount);
    }

    if (itemCount >= 30) {
        const bulkDiscount = subtotal * 0.25;
        const itemDiscount = subtotal - totalAmount;

        if (bulkDiscount > itemDiscount) {
            totalAmount = subtotal * 0.75;
        }
    }

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
