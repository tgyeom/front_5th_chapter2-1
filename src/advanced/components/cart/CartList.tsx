import React from "react";

interface CartListProps {
  cartItems: CartOrder.CartItem[];
  products: CartOrder.Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

const CartList: React.FC<CartListProps> = ({
  cartItems,
  products,
  onQuantityChange,
  onRemove,
}) => {
  if (cartItems.length === 0) {
    return <div className="text-gray-500 mb-4">장바구니가 비어있습니다.</div>;
  }

  return (
    <div className="mb-4">
      {cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        return (
          <div
            key={item.productId}
            id={item.productId}
            className="flex justify-between items-center mb-2 p-2 border-b border-gray-200"
          >
            <span>
              {product.name} - {product.price}원 x {item.quantity}
            </span>
            <div>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-1 hover:bg-blue-600"
                onClick={() => onQuantityChange(item.productId, -1)}
              >
                -
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-1 hover:bg-blue-600"
                onClick={() => onQuantityChange(item.productId, 1)}
              >
                +
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => onRemove(item.productId)}
              >
                삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartList;
