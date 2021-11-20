<template>
  <section class="category section">
    <div class="category__wrap wrap">
      <div class="category__heading">
        <h1 class="title title_lg category__title">Поиск по: {{ search }}</h1>
        <span class="category__suptitle" v-if="products.length > 0">Найдено {{ productsCount }}</span>
      </div>

      <form class="category__search" @submit.prevent="onSearch">
        <input type="text" v-model="searchInput" @input="onSearch" class="category__search-input" />
        <button type="submit" class="category__search-btn" @click="onSearch">
          <svg class="category__search-ico" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.6082 16.3917C18.1008 15.9057 17.607 15.4058 17.1273 14.8924C16.7243 14.4829 16.4816 14.185 16.4816 14.185L13.4483 12.7366C14.6627 11.3593 15.3329 9.58623 15.3333 7.75C15.3333 3.56941 11.9316 0.166664 7.74996 0.166664C3.56829 0.166664 0.166626 3.56941 0.166626 7.75C0.166626 11.9306 3.56829 15.3333 7.74996 15.3333C9.65988 15.3333 11.4008 14.6183 12.7365 13.4494L14.185 16.4827C14.185 16.4827 14.4829 16.7254 14.8924 17.1284C15.3116 17.5217 15.863 18.0536 16.3917 18.6093L17.8629 20.1173L18.5172 20.8172L20.815 18.5194L20.1151 17.8651C19.7045 17.4621 19.1564 16.9269 18.6082 16.3917ZM7.74996 13.1667C4.76321 13.1667 2.33329 10.7367 2.33329 7.75C2.33329 4.76325 4.76321 2.33333 7.74996 2.33333C10.7367 2.33333 13.1666 4.76325 13.1666 7.75C13.1666 10.7367 10.7367 13.1667 7.74996 13.1667Z" fill="black" fill-opacity="0.3"/>
          </svg>
        </button>
      </form>
      <div class="category__search-result">
        <Loading v-if="loading" isSearch="true" />
        <div class="category__row category__row_default" v-if="products.length > 0">
          <ProductItem
            v-for="product in products"
            :key="product.id"
            :product="product"
            @updateCart="updateCart"
            @quickView="quickView"
          />
        </div>
      </div>

    </div>
  </section>
</template>
<script>
import axios from "axios";
import { choseWordForm } from "@/src/helpers/prepare.js";
import ProductItem from './components/Search/ProductItem';
import Loading from "./components/Loading/Loading";
import { Cart } from '../plugins/Cart';
import { SingleProduct } from '../plugins/SingleProduct';

export default {
  name: "Search",
  components: {
    ProductItem,
    Loading
  },
  data() {
    return {
      search: "",
      searchInput: "",
      products: [],
      loading: false,
      instanceCart: new Cart(".js-cart", ".js-cart-count"),
      instanceSingleProduct: new SingleProduct(),
    }
  },
  computed: {
    productsCount() {
      return this.products.length + ' ' + choseWordForm(this.products.length, 'товар', 'товара', 'товаров');
    },
    cart() {
      return this.instanceCart.getProductsQty();
    }
  },
  methods: {
    onSearch() {
      if (this.searchInput.length > 2) {
        const val = this.searchInput;

        if (val !== this.search) {
          this.loading = true;
          this.fetchProductBySearch(val);
          this.search = val;
        }
      }
    },
    fetchProductBySearch(s) {
      axios.get("/api/search/" + s)
      .then(response => {
        this.products = response.data;
        this.updateProductQty();
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.loading = false;
      })
    },
    updateProductQty() {
      this.products.map(product => {
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
    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('search')) {
      this.searchInput = this.search = urlParams.get('search');
      this.fetchProductBySearch(this.search)
    }
  }
}
</script>