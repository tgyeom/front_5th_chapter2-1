import { CLASS, PRODUCT_LIST } from '../constants';

const CartTotal = (amount, discountRate) => {
    let html = `총액: ${Math.round(amount)}원`;

    if (discountRate > 0) {
        html += `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;
    }

    return html;
}

const CartItem = (product) => {
    return `
        <span>${product.name} - ${product.price}원 x 1</span>
        <div>
          <button class="${CLASS.quantityChange} bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
          <button class="${CLASS.quantityChange} bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
          <button class="${CLASS.removeItem} bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
        </div>
    `;
}

const Points = (points) => {
    return `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${points})</span>`;
}

const ProductOptions = () => {
    let optionsHTML = '';
    PRODUCT_LIST.forEach(function (item) {
        const disabled = item.quantity === 0 ? 'disabled' : '';
        optionsHTML += `<option value="${item.id}" ${disabled}>${item.name} - ${item.price}원</option>`;
    });
    return optionsHTML;
}

const StockStatus = () => {
    let infoMessage = '';
    PRODUCT_LIST.forEach(function (item) {
        if (item.quantity < 5) {
            infoMessage += `${item.name}: ${item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절'}<br>`;
        }
    });
    return infoMessage;
}

export const UIComponents = {
    CartTotal,
    CartItem,
    Points,
    ProductOptions,
    StockStatus
};