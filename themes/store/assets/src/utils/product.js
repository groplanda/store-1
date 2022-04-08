export function getProductsIds(storage) {
  return storage.filter(el => !el.optionId).map(el => el.id)
}

export function getProductsIdsWithOptions(storage) {
  return storage.filter(el => el.optionId && el.optionId).map(el => {
    return { id: el.id, optionId: el.optionId };
  })
}

export function createProductData(item, index, data) {
  if (hasProductOption(item.options)) {
    const productOption = item.options[0];
    item.optionId = productOption.id;
    item.amount = findAmountByOptionId(data, productOption.id);
    item.price = productOption.price;
    item.sale_price = productOption.sale_price;
    item.title = item.title + ' - ' + productOption.product_option.name + ' ' + productOption.option_value.name;
  } else {
    item.amount = findAmountById(data, item.id);
  }
  item.index = index + '-' + item.id;
  return item;
}

function findAmountByOptionId(array, optionId) {
  return array.find(el => +el.optionId == +optionId).amount
}

function findAmountById(array, id) {
  return array.find(el => +el.id == +id).amount
}

function hasProductOption(options) {
  return options && options.length > 0;
}


