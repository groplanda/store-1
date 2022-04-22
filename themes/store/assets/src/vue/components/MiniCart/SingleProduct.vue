<template>
  <div class="mini-cart__product">
    <div class="mini-cart__product-image">
      <picture>
        <source :srcset="product.image ? '/storage/app/media' + product.image : noImage">
        <img :src="product.image ? '/storage/app/media' + product.image : noImage" :alt="product.title" class="mini-cart__product-thumb" />
      </picture>
    </div>
    <div class="mini-cart__product-body">
      <a :href="'/product/' + product.id" class="mini-cart__product-name">{{ product.title }}</a>

      <div class="mini-cart__controls">
        <div class="mini-cart__product-prices" v-if="checkoutEl">
          <div class="mini-cart__product-price" v-if="product.sale_price > 0">{{ productPrice(product.sale_price) }}</div>
          <div class="mini-cart__product-price" :class="{'mini-cart__product-price_strike' : product.sale_price > 0}">{{ productPrice(product.price) }}</div>
        </div>
        <div class="mini-cart__product-prices" v-else>
          <div class="mini-cart__product-price" v-if="product.sale_price > 0">{{ productPrice(product.sale_price) }}</div>
          <div class="mini-cart__product-price" v-else>{{ productPrice(product.price) }}</div>
        </div>
        <AmountProduct :amount="count" @changeAmount="changeAmount" />

        <button type="button" class="mini-cart__product-remove" @click="deleteProduct">
          <svg class="mini-cart__product-trash">
            <use :xlink:href="$sprite_path + '#sprite-trash'"></use>
          </svg>
        </button>

      </div>


    </div>

  </div>
</template>
<script>
import AmountProduct from "./AmountProduct";

export default {
  name: "SingleProduct",
  components: {
    AmountProduct
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    checkoutEl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      count: this.product.amount,
      noImage: "/themes/store/assets/images/no-image.jpg"
    }
  },
  computed: {
    currency() {
      return this.$store.getters.getCurrency;
    }
  },
  methods: {
    productPrice(price) {
      return (price * this.currency).toLocaleString('ru') + ' ₽';
    },
    changeAmount(val) {
      this.count = val;
      const optionId = this.product.optionId ? this.product.optionId : null;
      this.$emit("changeAmount", { id: this.product.id, amount: this.count, optionId: optionId });
    },
    deleteProduct() {
      this.$emit("deleteProduct", { id: this.product.id });
    }
  }
}
</script>
