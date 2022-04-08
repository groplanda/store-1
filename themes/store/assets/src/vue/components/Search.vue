<template>
  <section class="category section">
    <div class="category__wrap wrap">
      <div class="category__heading category__heading--space">
        <div class="category__heading">
          <h1 class="category__title">
            Поиск по: <span class="category__title-colored">{{ search }}</span>
            <sup class="category__total" v-if="products.length > 0">Найдено: {{ productsCount }}</sup>
          </h1>
        </div>
        <div class="filter">
          <input type="text" placeholder="Поиск по каталогу..." class="filter__input" v-model="searchInput" @input="onSearch" />
          <button type="button" class="filter__btn" @click="onSearch">
            <svg class="filter__btn-ico icon-shopping-cart">
              <use :xlink:href="$sprite_path + '#sprite-search'"></use>
            </svg>
          </button>
        </div>
      </div>
      <div class="category__container">
        <div class="category__row">
          <Loading v-if="loading" :isSearch="true" />
          <ProductItem v-for="product in products" :key="product.id" :product="product" />
        </div>
        <div class="category__empty" v-if="products.length === 0">Ничего не удалось найти...</div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { choseWordForm } from "@/src/helpers/prepare.js";
import { debounce } from "debounce";
import ProductItem from "./Search/ProductItem";
import Loading from "./Loading/Loading";
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
