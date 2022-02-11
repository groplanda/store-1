<template>
  <section class="category section">
    <div class="category__container container container--main">
      <div class="category__heading category__heading--space">
        <div class="category__title">
          Поиск по:
          <span class="category__search-val">{{ search }}</span>
        </div>
        <div class="filter">
          <input type="text" placeholder="Поиск по каталогу..." class="filter__input" v-model="searchInput" @input="onSearch" />
          <button type="button" class="filter__btn" @click="onSearch">
            <svg viewBox="0 0 22 22" class="filter__btn-ico icon-search">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 2a7 7 0 1 0 0 14A7 7 0 0 0 9 2zM0 9a9 9 0 1 1 16.032 5.618l5.675 5.675a1 1 0 0 1-1.414 1.414l-5.675-5.675A9 9 0 0 1 0 9z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="category__total" v-if="products.length > 0">Найдено: {{ productsCount }}</div>
      <div v-else>Ничего не удалось найти...</div>
      <div class="category__row">
        <Loading v-if="loading" :isSearch="true" />
        <ProductItem v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { choseWordForm } from "@/src/helpers/prepare.js";
import { debounce } from "debounce";
import ProductItem from "./components/Search/ProductItem";
import Loading from "./components/Loading/Loading";
import { setPageParam } from '@/src/helpers/url';

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
    };
  },
  computed: {
    productsCount() {
      return (
        this.products.length +
        " " +
        choseWordForm(this.products.length, "товар", "товара", "товаров")
      );
    }
  },
  methods: {
    onSearch: debounce(function() {
      if (this.searchInput.length > 2) {
        const val = this.searchInput;

        if (val !== this.search) {
          this.loading = true;
          this.fetchProductBySearch(val);
          this.search = val;
        }
      }
    }, 300),
    fetchProductBySearch(s) {
      axios
        .get("/api/search/" + s)
        .then(response => {
          this.products = response.data;
        })
        .catch(error => {
          console.log(error.response);
        })
        .finally(() => {
          this.loading = false;
          setPageParam({ 'search': s })
        });
    }
  },
  created() {
    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("search")) {
      this.searchInput = this.search = urlParams.get("search");
      this.fetchProductBySearch(this.search);
    }
  }
};
</script>
