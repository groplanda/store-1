<template lang="pug">
  .cart-table
    ._inner
      ._heading
        ._heading-left
          ._heading-title Товар
        ._heading-right
          ._heading-title Цена
          ._heading-title Кол-во
          ._heading-title Сумма
      ._body
        CartItem(
          v-for="product in cartProduct"
          :key="product.id"
          :product="product"
          @deleteProduct="deleteProduct"
          @updateProduct="updateProduct")

</template>
<script>
import CartItem from "./CartItem"

export default {
  name: "CartTable",
  components: {
    CartItem
  },
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      cartProduct: this.products
    }
  },
  watch: {
    products() {
      this.cartProduct = this.products;
    }
  },
  methods: {
    deleteProduct(id) {
      const productIndex = this.cartProduct.findIndex(el => el.id === id);
      if (productIndex !== -1) {
        this.cartProduct.splice(productIndex, 1);
      }
    },
    updateProduct(data) {
      const productIndex = this.cartProduct.findIndex(el => el.id === data.id);
      this.cartProduct[productIndex].amount =  data.amount;
    }
  }
}
</script>