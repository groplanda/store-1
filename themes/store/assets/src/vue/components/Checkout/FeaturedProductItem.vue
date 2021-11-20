<template>
  <div class="checkout__featured-item">
    <div class="checkout__featured-item-image">
      <a :href="'/product/' + product.id">
        <img :src="product.image ? '/storage/app/media' + product.image : noImage" :alt="product.title" class="checkout__cart-item-thumb" />
      </a>
    </div>
    <div class="checkout__featured-item-content">
      <div class="checkout__featured-item-title">{{ product.title }}</div>
      <div class="checkout__featured-item-price">{{ price }}</div>
    </div>
    <CartAmount :amount="count" @changeAmount="changeAmount" :minAmount="0" />
  </div>
</template>
<script>
import CartAmount from "./CartAmount";

export default {
  name: "FeaturedProductItem",
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
  computed: {
    price() {
      return this.product.currentPrice.toLocaleString('ru') + ' ₽';
    },
  },
  methods: {
    changeAmount(val) {
      this.count = val;
      this.$emit("changeAmount", { id: this.product.id, amount: this.count });
    }
  }
}
</script>