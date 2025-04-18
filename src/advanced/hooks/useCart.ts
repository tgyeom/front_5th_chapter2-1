import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";

// 컴포넌트별 장바구니 관련 UI 상태 관리 훅
const useCart = () => {
  const cartContext = useCartContext();
  const [selectedProductId, setSelectedProductId] = useState(
    cartContext.products[0]?.id || ""
  );

  return {
    ...cartContext,
    selectedProductId,
    setSelectedProductId,
  };
};

export default useCart;
