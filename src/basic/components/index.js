import ProductOptions from './ProductOptions';
import CartItem from './CartItem';
import CartTotal from './CartTotal';
import Points from './Points';
import StockStatus from './StockStatus';

export {
    ProductOptions,
    CartItem,
    CartTotal,
    Points,
    StockStatus
};

export const UIComponents = {
    createCartItemUI: CartItem,
    createStockStatusUI: StockStatus
};
