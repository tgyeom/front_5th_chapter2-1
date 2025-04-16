ProductOptions = () => {
    let optionsHTML = '';
    PRODUCT_LIST.forEach(function (item) {
        const disabled = item.quantity === 0 ? 'disabled' : '';
        optionsHTML += `<option value="${item.id}" ${disabled}>${item.name} - ${item.price}원</option>`;
    });
    return optionsHTML;
}

export default ProductOptions;