// boolean형은 is 형태로 작성

declare namespace CartOrder {
  interface CartState {
    lastSelectedProduct: string | null;
    bonusPoints: number;
    totalAmount: number;
    itemCount: number;
    discountRate: number;
    isTuesdayDiscount: boolean;
  }

  interface CartItem {
    productId: string;
    quantity: number;
  }

  interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface Class {
    quantityChange: string;
    removeItem: string;
  }

  interface CartSummary {
    totalAmount: number;
    itemCount: number;
    subtotal: number;
    discountRate: number;
    isTuesdayDiscount: boolean;
    bonusPoints: number;
  }

  interface CartItemProps {
    product: Product;
    onQuantityChange: (productId: string, change: number) => void;
    onRemove: (productId: string) => void;
  }

  interface CartTotalProps {
    amount: number;
    discountRate: number;
  }

  interface PointsProps {
    points: number;
  }

  interface StockStatusProps {
    products: Product[];
  }
}
