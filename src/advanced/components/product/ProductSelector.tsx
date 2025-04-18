import React from "react";

interface ProductSelectorProps {
  products: CartOrder.Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onProductSelect,
  onAddToCart,
}) => {
  // 선택된 상품 찾기
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="flex flex-col mb-4">
      <h2 className="text-lg font-semibold mb-2">상품 선택</h2>
      <div className="flex">
        <select
          className="border rounded p-2 mr-2 flex-grow"
          value={selectedProductId}
          onChange={(e) => onProductSelect(e.target.value)}
        >
          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.quantity <= 0}
            >
              {product.name} ({product.quantity}개 남음) - {product.price}원
            </option>
          ))}
        </select>
        <button
          onClick={() => onAddToCart(selectedProductId)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={
            !selectedProductId ||
            (selectedProduct && selectedProduct.quantity <= 0)
          }
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default ProductSelector;
