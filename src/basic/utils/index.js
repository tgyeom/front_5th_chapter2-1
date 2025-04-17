import PRODUCT_LIST from "../constants";

const getProductById = (productId) => {
    return PRODUCT_LIST.find(product => product.id === productId);
}

export { getProductById }