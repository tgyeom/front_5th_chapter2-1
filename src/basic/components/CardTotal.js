const CartTotal = (amount, discountRate) => {
    let html = `총액: ${Math.round(amount)}원`;

    if (discountRate > 0) {
        html += `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;
    }

    return html;
}

export default CartTotal;