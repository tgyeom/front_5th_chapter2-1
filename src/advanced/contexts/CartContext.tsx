import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { cartCalculate } from "../utils/cartCalculate";
import {
  lightningSale,
  suggestedPromotion,
} from "../services/promotionService";

interface CartState {
  lastSelectedProduct: string | null;
  bonusPoints: number;
  totalAmount: number;
  itemCount: number;
  discountRate: number;
  isTuesdayDiscount: boolean;
}

interface CartContextType {
  products: CartOrder.Product[];
  setProducts: React.Dispatch<React.SetStateAction<CartOrder.Product[]>>;
  cartItems: CartOrder.CartItem[];
  cartState: CartState;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  removeCartItem: (productId: string) => void;
}

interface CartProviderProps {
  children: ReactNode;
  initialProducts: CartOrder.Product[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  initialProducts,
}) => {
  const [products, setProducts] = useState<CartOrder.Product[]>([
    ...initialProducts,
  ]);
  const [cartItems, setCartItems] = useState<CartOrder.CartItem[]>([]);
  const [cartState, setCartState] = useState<CartState>({
    lastSelectedProduct: null,
    bonusPoints: 0,
    totalAmount: 0,
    itemCount: 0,
    discountRate: 0,
    isTuesdayDiscount: false,
  });

  // 장바구니에 상품 추가
  const addToCart = (productId: string) => {
    const productToAdd = products.find((p) => p.id === productId);

    if (!productToAdd || productToAdd.quantity <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      updateQuantity(productId, 1);
    } else {
      setCartItems([...cartItems, { productId, quantity: 1 }]);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    }

    setCartState((prev) => ({ ...prev, lastSelectedProduct: productId }));
  };

  // 장바구니 상품 수량 업데이트
  const updateQuantity = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (change > 0 && product.quantity <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    const itemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex === -1) return;

    const newQuantity = cartItems[itemIndex].quantity + change;

    if (newQuantity <= 0) {
      removeCartItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - change } : p
      )
    );
  };

  // 장바구니에서 상품 제거
  const removeCartItem = (productId: string) => {
    const itemToRemove = cartItems.find((item) => item.productId === productId);
    if (!itemToRemove) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity: p.quantity + itemToRemove.quantity }
          : p
      )
    );

    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // 장바구니 정보 업데이트
  useEffect(() => {
    const newState = cartCalculate(
      cartItems,
      products,
      cartState.lastSelectedProduct
    );
    setCartState(newState);
  }, [cartItems, products]);

  // 프로모션 이벤트 관리
  useEffect(() => {
    const saleTimer = setInterval(() => {
      const updatedProducts = [...products];
      lightningSale(updatedProducts, () => setProducts([...updatedProducts]));
    }, 30000);

    const suggestTimer = setInterval(() => {
      if (cartState.lastSelectedProduct) {
        const updatedProducts = [...products];
        suggestedPromotion(updatedProducts, cartState.lastSelectedProduct, () =>
          setProducts([...updatedProducts])
        );
      }
    }, 60000);

    return () => {
      clearInterval(saleTimer);
      clearInterval(suggestTimer);
    };
  }, [products, cartState.lastSelectedProduct]);

  const value = {
    products,
    setProducts,
    cartItems,
    cartState,
    addToCart,
    updateQuantity,
    removeCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("error");
  }
  return context;
};
