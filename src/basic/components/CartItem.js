import { CLASS } from '../constants';
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

export default CartItem;