<template>
  <section class="category section">
    <Loading v-if="loading" />
    <div class="category__wrap wrap" v-else>

      <div class="category__search-result">
        <div class="category__row category__row_default" v-if="wishlist.length > 0">
          <ProductItem
            v-for="product in wishlist"
            :key="product.id"
            :product="product"
            @updateCart="updateCart"
            @quickView="quickView"
          />
        </div>
        <div class="account__subtitle" v-else>В избранном ничего нет...</div>
      </div>
    </div>
  </section>

</template>
<script>
import axios from "axios";
import ProductItem from "../Search/ProductItem";
import Loading from "../Loading/Loading";
import { Cart } from '../../../plugins/Cart';
import { SingleProduct } from '../../../plugins/SingleProduct';

export default {
  name: "Wish",
  components: {
    ProductItem,
    Loading
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      wishlist: [],
      loading: true,
      instanceCart: new Cart(".js-cart", ".js-cart-count"),
      instanceSingleProduct: new SingleProduct(),
    }
  },
  computed: {
    cart() {
      return this.instanceCart.getProductsQty();
    }
  },
  methods: {
    fetchWish() {
      axios.get("/api/user/wish/" + this.userId)
      .then(response => {
        const data = response.data;
        this.wishlist = data;
        this.loading = false;
        this.updateProductQty();
      })
      .catch(error => {
        console.log(error);
      })
    },
    updateProductQty() {
      this.wishlist.map(product => {
        const index = this.cart.findIndex(c => c.id === product.id);
        if (index !== -1) {
          product.amount = this.cart[index].amount;
        } else {
          product.amount = 0;
        }
        return product;
      })
    },
    updateCart(data) {
      this.instanceCart.addToCart(data);
    },
    quickView(productId) {
      if (!productId) return;
      this.instanceSingleProduct.fecthProductData(productId);
    }
  },
  created() {
    this.fetchWish();
  }
}
</script>
