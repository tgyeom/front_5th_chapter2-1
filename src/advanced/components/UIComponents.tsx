import React from "react";
import { PRODUCT_LIST } from "../constants";

interface CartTotalProps {
  amount: number;
  discountRate: number;
}

export const CartTotal: React.FC<CartTotalProps> = ({
  amount,
  discountRate,
}) => {
  return (
    <div>
      총액: {Math.round(amount)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
    </div>
  );
};

interface CartItemProps {
  product: CartOrder.Product;
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  product,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {product.name} - {product.price}원 x 1
      </span>
      <div>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onQuantityChange(product.id, -1)}
        >
          -
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onQuantityChange(product.id, 1)}
        >
          +
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onRemove(product.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

interface PointsProps {
  points: number;
}

export const Points: React.FC<PointsProps> = ({ points }) => {
  return (
    <span id="loyalty-points" className="text-blue-500 ml-2">
      (포인트: {points})
    </span>
  );
};

export const ProductOptions: React.FC = () => {
  return (
    <>
      {PRODUCT_LIST.map((item) => (
        <option key={item.id} value={item.id} disabled={item.quantity === 0}>
          {item.name} - {item.price}원
        </option>
      ))}
    </>
  );
};

export const StockStatus: React.FC<{ products: CartOrder.Product[] }> = ({
  products,
}) => {
  return (
    <>
      {products.map(
        (item) =>
          item.quantity < 5 && (
            <div key={item.id}>
              {item.name}:{" "}
              {item.quantity > 0
                ? `재고 부족 (${item.quantity}개 남음)`
                : "품절"}
            </div>
          )
      )}
    </>
  );
};

export const UIComponents = {
  CartTotal,
  CartItem,
  Points,
  ProductOptions,
  StockStatus,
};
