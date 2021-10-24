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
            <svg class="category__search-ico" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 13L9 9M10.3333 5.66667C10.3333 6.2795 10.2126 6.88634 9.97811 7.45252C9.74358 8.01871 9.39984 8.53316 8.9665 8.9665C8.53316 9.39984 8.01871 9.74358 7.45252 9.97811C6.88634 10.2126 6.2795 10.3333 5.66667 10.3333C5.05383 10.3333 4.447 10.2126 3.88081 9.97811C3.31462 9.74358 2.80018 9.39984 2.36683 8.9665C1.93349 8.53316 1.58975 8.01871 1.35523 7.45252C1.12071 6.88634 1 6.2795 1 5.66667C1 4.42899 1.49167 3.242 2.36683 2.36683C3.242 1.49167 4.42899 1 5.66667 1C6.90434 1 8.09133 1.49167 8.9665 2.36683C9.84167 3.242 10.3333 4.42899 10.3333 5.66667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
      </form>
      <div class="category__search-result">
        <Loading v-if="loading" isSearch="true" />
        <div class="category__row category__row_default" v-if="products.length > 0">
          <ProductItem v-for="product in products" :key="product.id" :product="product" />
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
      loading: false
    }
  },
  computed: {
    productsCount() {
      return this.products.length + ' ' + choseWordForm(this.products.length, 'товар', 'товара', 'товаров');
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
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.loading = false;
      })
    }
  },
  created() {
    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('search')) {
      this.searchInput = this.search = urlParams.get('search');
      this.fetchProductBySearch(this.search)
    }
  },
}
</script>