<template>
  <div class="mini-cart">
    <div class="mini-cart__products" v-if="hasProducts">
      <div class="mini-cart__total">
        Сумма: <span>{{ calculateTotal }}</span>
      </div>
      <SingleProduct
        v-for="product in products"
        :key="product.index"
        :product="product"
        @changeAmount="changeAmount"
        @deleteProduct="deleteProduct"
      />
      <a href="/checkout" class="button mini-cart__order">Оформить заказ</a>
    </div>
    <div class="mini-cart__empty" v-else>
      <svg class="mini-cart__empty-ico">
        <use :xlink:href="$sprite_path + '#sprite-mini-cart'"></use>
      </svg>
      <div class="mini-cart__empty-info">Ваша корзина пуста</div>
      <a href="/catalog" class="button mini-cart__empty-url">Каталог товаров</a>
    </div>
  </div>
</template>
<script>
import SingleProduct from './MiniCart/SingleProduct.vue';
import { createMessage } from '@/src/utils/index';

export default {
  name: "MiniCart",
  components: {
    SingleProduct
  },
  computed: {
    products() {
      return this.$store.getters.getProducts;
    },
    calculateTotal() {
      return this.$store.getters.getTotal;
    },
    hasProducts() {
      return this.$store.getters.hasProducts
    }
  },
  methods: {
    changeAmount(data) {
      this.$store.dispatch('changeAmount', data);
      createMessage({
        key: 'default',
        message: 'Кол-во изменено'
      })
    },
    deleteProduct(data) {
      this.$store.dispatch('deleteProduct', data);
      createMessage({
        key: 'remove',
        message: 'Товар удален из корзины'
      })
    }
  },
  mounted() {
    const storage = localStorage.getItem(process.env.MIX_STORE);

    if (storage) {
      this.$store.dispatch('fillProducts', JSON.parse(storage));
    }

    window.addEventListener('change-cart-storage', (event) => {
      console.log(event.detail.storage);
      if (event.detail.storage) {
        this.$store.dispatch('updateProducts', {
          'data': JSON.parse(event.detail.storage),
          'changed': event.detail.changed
        });
      }
    });
  }
}
</script>
