<template>
  <div class="category">
    <Loading v-if="loading" />
    <div class="category__content" v-else>
      <div class="category__container">
        <div class="category__row category__row_catalog" v-if="wishlist.length > 0">
          <ProductItem v-for="product in wishlist" :key="product.id" :product="product" :isWish="true" />
        </div>
        <div class="title title_sm account__title" v-else>В избранном ничего нет...</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import ProductItem from "../Search/ProductItem";
import Loading from "../Loading/Loading";

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
      loading: true
    }
  },
  methods: {
    fetchWish() {
      axios.get("/api/user/wish/" + this.userId)
      .then(response => {
        const data = response.data;
        this.wishlist = data;
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
  created() {
    this.fetchWish();
  }
}
</script>
