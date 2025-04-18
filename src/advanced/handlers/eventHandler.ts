import { CLASS } from "../constants";

const handleAddToCartClick =
  (productSelectEl: { value: string }, addToCart: (arg0: string) => void) =>
  () => {
    const selectedId = productSelectEl.value;
    addToCart(selectedId);
  };

const handleCartItemsClick = (
  event: { target: any },
  updateQuantity: (arg0: any, arg1: number) => void,
  removeCartItem: (arg0: any) => void
) => {
  const target = event.target;

  if (target.classList.contains(CLASS.quantityChange)) {
    const productId = target.dataset.productId;
    const change = parseInt(target.dataset.change);
    updateQuantity(productId, change);
  } else if (target.classList.contains(CLASS.removeItem)) {
    const productId = target.dataset.productId;
    removeCartItem(productId);
  }
};

export { handleAddToCartClick, handleCartItemsClick };
