import { useEffect } from "react";
import {
  lightningSale,
  suggestedPromotion,
} from "../services/promotionService";

interface UsePromotionProps {
  products: CartOrder.Product[];
  setProducts: React.Dispatch<React.SetStateAction<CartOrder.Product[]>>;
  lastSelectedProduct: string | null;
}

const usePromotion = ({
  products,
  setProducts,
  lastSelectedProduct,
}: UsePromotionProps) => {
  // 프로모션 이벤트 관리
  useEffect(() => {
    // 번개세일 프로모션 (30초 간격)
    const saleTimer = setInterval(() => {
      const updatedProducts = [...products];
      lightningSale(updatedProducts, () => setProducts([...updatedProducts]));
    }, 30000);

    // 추천 프로모션 (60초 간격)
    const suggestTimer = setInterval(() => {
      if (lastSelectedProduct) {
        const updatedProducts = [...products];
        suggestedPromotion(updatedProducts, lastSelectedProduct, () =>
          setProducts([...updatedProducts])
        );
      }
    }, 60000);

    // 타이머 정리
    return () => {
      clearInterval(saleTimer);
      clearInterval(suggestTimer);
    };
  }, [products, lastSelectedProduct, setProducts]);

  return {
    // 프로모션 관련 추가 메소드가 필요하면 여기에 추가
  };
};

export default usePromotion;
