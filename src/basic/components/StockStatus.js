import { PRODUCT_LIST } from '../constants';

const StockStatus = () => {
    let infoMessage = '';
    PRODUCT_LIST.forEach(function (item) {
        if (item.quantity < 5) {
            infoMessage += `${item.name}: ${item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절'}<br>`;
        }
    });
    return infoMessage;
}

export default StockStatus;