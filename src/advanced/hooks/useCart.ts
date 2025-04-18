import { useState, useEffect } from "react";
import { getQuantityDiscountRate } from "../services/discountService";

interface UseCartProps {
  initialProducts: CartOrder.Product[];
}

interface CartState {
  lastSelectedProduct: string | null;
  bonusPoints: number;
  totalAmount: number;
  itemCount: number;
  discountRate: number;
  isTuesdayDiscount: boolean;
}

/**
 * 장바구니 상태 관리 훅
 * @param initialProducts 초기 제품 목록
 * @returns 장바구니 상태 관리 훅 객체
 */
const useCart = ({ initialProducts }: UseCartProps) => {
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

  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ""
  );

  // 장바구니에 상품 추가
  const addToCart = (productId: string) => {
    const productToAdd = products.find((p) => p.id === productId);

    if (!productToAdd || productToAdd.quantity <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    // 이미 장바구니에 있는 상품인지 확인
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // 이미 있으면 수량만 업데이트
      updateQuantity(productId, 1);
    } else {
      // 없으면 새로 추가
      setCartItems([...cartItems, { productId, quantity: 1 }]);

      // 제품 재고 감소
      const updatedProducts = products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
      );

      setProducts(updatedProducts);
    }

    setCartState((prev) => ({ ...prev, lastSelectedProduct: productId }));
  };

  // 장바구니 상품 수량 업데이트
  const updateQuantity = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // 재고 확인
    if (change > 0 && product.quantity <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) return;

    const newQuantity = updatedCartItems[itemIndex].quantity + change;

    if (newQuantity <= 0) {
      // 수량이 0 이하면 상품 제거
      removeCartItem(productId);
      return;
    }

    // 장바구니 아이템 업데이트
    updatedCartItems[itemIndex].quantity = newQuantity;
    setCartItems(updatedCartItems);

    // 제품 재고 업데이트
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity - change } : p
    );

    setProducts(updatedProducts);
  };

  // 장바구니에서 상품 제거
  const removeCartItem = (productId: string) => {
    // 제거할 상품 찾기
    const itemToRemove = cartItems.find((item) => item.productId === productId);
    if (!itemToRemove) return;

    // 제품 재고 회복
    const updatedProducts = products.map((p) =>
      p.id === productId
        ? { ...p, quantity: p.quantity + itemToRemove.quantity }
        : p
    );

    // 장바구니에서 제거
    const updatedCartItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    setProducts(updatedProducts);
    setCartItems(updatedCartItems);
  };

  // 장바구니 정보 업데이트
  useEffect(() => {
    // 장바구니가 비어있으면 계산할 필요 없음
    if (cartItems.length === 0) {
      setCartState({
        lastSelectedProduct: null,
        bonusPoints: 0,
        totalAmount: 0,
        itemCount: 0,
        discountRate: 0,
        isTuesdayDiscount: false,
      });
      return;
    }

    // 장바구니 요약 정보 계산
    let totalAmount = 0;
    let itemCount = 0;
    let subtotal = 0;

    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;

      const quantity = item.quantity;
      const itemPrice = product.price * quantity;

      itemCount += quantity;
      subtotal += itemPrice;

      let discount =
        quantity >= 10 ? getQuantityDiscountRate(item.productId) : 0;
      totalAmount += itemPrice * (1 - discount);
    });

    // 대량 구매 할인 적용
    if (itemCount >= 30) {
      const bulkDiscount = subtotal * 0.25;
      const itemDiscount = subtotal - totalAmount;

      if (bulkDiscount > itemDiscount) {
        totalAmount = subtotal * 0.75;
      }
    }

    // 화요일 할인 적용
    let isTuesdayDiscount = false;
    if (new Date().getDay() === 2) {
      isTuesdayDiscount = true;
      totalAmount *= 0.9;
    }

    const discountRate = subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0;
    const bonusPoints = Math.floor(totalAmount / 1000);

    setCartState({
      lastSelectedProduct: cartState.lastSelectedProduct,
      bonusPoints,
      totalAmount,
      itemCount,
      discountRate,
      isTuesdayDiscount,
    });
  }, [cartItems, products]);

  return {
    products,
    setProducts,
    cartItems,
    cartState,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    updateQuantity,
    removeCartItem,
  };
};

export default useCart;
