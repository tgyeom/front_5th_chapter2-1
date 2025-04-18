import React, { memo } from "react";
import { StockStatus } from "../UIComponents";

interface StockStatusDisplayProps {
  products: CartOrder.Product[];
}

const StockStatusDisplay: React.FC<StockStatusDisplayProps> = ({
  products,
}) => {
  const lowStockProducts = products.filter((product) => product.quantity < 5);

  // 얼리 리턴?
  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
      <h3 className="text-md font-semibold mb-2 text-yellow-700">재고 알림</h3>
      <div className="text-sm text-gray-600">
        <StockStatus products={products} />
      </div>
    </div>
  );
};

export default memo(StockStatusDisplay);
