import React from "react";
import { PRODUCT_LIST } from "./constants";
import useCart from "./hooks/useCart";
import CartList from "./components/cart/CartList";
import CartSummary from "./components/cart/CartSummary";
import ProductSelector from "./components/product/ProductSelector";
import StockStatusDisplay from "./components/product/StockStatusDisplay";
import { CartProvider } from "./contexts/CartContext";

const CartApp: React.FC = () => {
  const {
    products,
    cartItems,
    cartState,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    updateQuantity,
    removeCartItem,
  } = useCart();

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">쇼핑 장바구니</h1>
        <ProductSelector
          products={products}
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
          onAddToCart={addToCart}
        />
        <div className="border-t border-gray-200 my-4"></div>
        <h2 className="text-lg font-semibold mb-2">장바구니 내역</h2>
        <CartList
          cartItems={cartItems}
          products={products}
          onQuantityChange={updateQuantity}
          onRemove={removeCartItem}
        />
        <CartSummary cartState={cartState} />
        <StockStatusDisplay products={products} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider initialProducts={PRODUCT_LIST}>
      <CartApp />
    </CartProvider>
  );
};

export default App;
