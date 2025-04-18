import React, { memo } from "react";
import { CartTotal, Points } from "../UIComponents";

interface CartSummaryProps {
  cartState: {
    totalAmount: number;
    discountRate: number;
    bonusPoints: number;
    isTuesdayDiscount: boolean;
  };
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartState }) => {
  if (cartState.totalAmount <= 0) {
    return null;
  }

  return (
    <div className="text-xl font-bold my-4 p-3 bg-gray-50 rounded-lg">
      {cartState.isTuesdayDiscount ? (
        <div>
          총액: {Math.round(cartState.totalAmount)}원
          <span className="text-green-500 ml-2">(10.0% 할인 적용)</span>
        </div>
      ) : (
        <CartTotal
          amount={cartState.totalAmount}
          discountRate={cartState.discountRate}
        />
      )}
      <Points points={cartState.bonusPoints} />

      {/* 추가 정보 */}
      <div className="text-sm text-gray-500 mt-2 font-normal">
        {cartState.discountRate > 0 && !cartState.isTuesdayDiscount && (
          <div>다양한 할인이 적용되었습니다.</div>
        )}
      </div>
    </div>
  );
};

export default memo(CartSummary);
