<template>
  <div class="category__item category__item_default">
    <div class="product-card product-card_page">
      <span class="product-card__label product-card__label_hit" v-if="product.is_hit">Акция</span>
      <div class="product-card__image">
        <picture class="product-card__picture">
          <source :srcset="product.image ? '/storage/app/media' + product.image : noImage" type="image/jpeg" class="product-card__image-src" />
          <img :src="product.image ? '/storage/app/media' + product.image : noImage" :alt="product.title" class="product-card__image-src" />
        </picture>
      </div>

      <div class="product-card__content">
        <div class="product-card__heading">
          <div class="product-card__name">{{ product.title }}</div>
        </div>

        <div class="product-card__bottom">
          <div class="product-card__prices">
            <template v-if="product.sale_price > 0">
            <div class="product-card__current-price">{{ basePrice }}</div>
            <div class="product-card__old-price">{{ salePrice }}</div>
            </template>
            <div class="product-card__current-price" v-else>{{ basePrice }}</div>
          </div>
          <button type="button" class="product-card__button" :data-product-id="product.id" data-js-action="add-to-cart" v-if="product.price > 0">
            <svg class="product-card__button-ico" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.43329 0.43335L1.95329 2.16668M1.95329 2.16668L4.03329 9.10002H13.5666V3.90002C13.5666 2.94272 12.7906 2.16668 11.8333 2.16668H1.95329ZM11.8333 12.5667C11.3546 12.5667 10.9666 12.1787 10.9666 11.7C10.9666 11.2214 11.3546 10.8333 11.8333 10.8333C12.3119 10.8333 12.7 11.2214 12.7 11.7C12.7 12.1787 12.3119 12.5667 11.8333 12.5667ZM4.89996 11.7C4.89996 11.2214 5.28797 10.8333 5.76662 10.8333C6.24527 10.8333 6.63329 11.2214 6.63329 11.7C6.63329 12.1787 6.24527 12.5667 5.76662 12.5667C5.28797 12.5667 4.89996 12.1787 4.89996 11.7Z" stroke="white"/>
            </svg>
          </button>
        </div>

      </div>
      <a :href="'/product/' + product.id" class="product-card__url"></a>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProductItem",
  props: {
    product: {
      type: Object,
      required: true,
    }
  },
  computed: {
    basePrice() {
      let price = 0;
      price = this.product.price.toLocaleString('ru') + ' ₽';
      return price;
    },
    salePrice() {
      let sale = 0;
      sale = this.product.sale_price.toLocaleString('ru') + ' ₽';
      return sale;
    }
  }
}
</script>
