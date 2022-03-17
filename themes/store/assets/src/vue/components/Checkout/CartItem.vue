<template>
<div class="checkout__cart-item">
  <div class="checkout__cart-item-image">
    <img :src="product.image ? '/storage/app/media' + product.image : noImage" :alt="product.title" class="checkout__cart-item-thumb" />
  </div>
  <div class="checkout__cart-item-content">
    <div class="checkout__cart-item-heading">
      <a :href="'/product/' + product.id" class="checkout__cart-item-title">{{ product.title }}</a>
    </div>
    <div class="checkout__cart-item-prices">
      <template v-if="product.sale_price > 0">
        <div class="checkout__cart-item-price">{{ productPrice(product.sale_price) }}</div>
        <div class="checkout__cart-item-oldprice">{{ productPrice(product.price) }}</div>
      </template>
      <div class="checkout__cart-item-price" v-else>{{ productPrice(product.price) }}</div>
    </div>
    <div class="checkout__cart-item-bottom">
      <CartAmount :amount="count" @changeAmount="changeAmount" />
      <button type="button" class="checkout__cart-item-remove" @click="deleteProduct">
        <svg class="checkout__cart-item-trash" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.8668 9.73335V16.1333M12.1335 9.73335V16.1333M1.4668 5.46668H18.5335M17.4668 5.46668L16.542 18.4181C16.5037 18.9564 16.2628 19.4601 15.868 19.8278C15.4731 20.1956 14.9536 20.4 14.414 20.4H5.58626C5.04668 20.4 4.52713 20.1956 4.13227 19.8278C3.73741 19.4601 3.49657 18.9564 3.45826 18.4181L2.53346 5.46668H17.4668ZM13.2001 5.46668V2.26668C13.2001 1.98378 13.0877 1.71247 12.8877 1.51243C12.6877 1.31239 12.4164 1.20001 12.1335 1.20001H7.8668C7.5839 1.20001 7.31259 1.31239 7.11255 1.51243C6.91251 1.71247 6.80013 1.98378 6.80013 2.26668V5.46668H13.2001Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</div>
</template>
<script>
import CartAmount from "./CartAmount.vue";

export default {
  name: "CartItem",
  components: {
    CartAmount
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      count: this.product.amount,
      noImage: "/themes/store/assets/images/no-image.jpg"
    }
  },
  methods: {
    productPrice(price) {
      return price.toLocaleString('ru') + ' ₽';
    },
    changeAmount(val) {
      this.count = val;
      const optionId = this.product.optionId ? this.product.optionId : null;
      this.$emit("changeAmount", { id: this.product.id, amount: this.count, optionId: optionId });
    },
    deleteProduct() {
      const optionId = this.product.optionId ? this.product.optionId : null;
      this.$emit("deleteProduct", { id: this.product.id, optionId: optionId });
    }
  }
}
</script>
