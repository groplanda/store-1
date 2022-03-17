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
import axios from "axios";
import SingleProduct from './components/MiniCart/SingleProduct.vue';
import { Cart } from '@/src/plugins/Cart';

export default {
  name: "MiniCart",
  data() {
    return {
      products: []
    }
  },
  components: {
    SingleProduct
  },
  computed: {
    hasProducts() {
      return this.products.length > 0;
    },
    calculateTotal() {
      let result = 0;
      this.products.forEach(product => {
        result += Number(product.amount) * Number(+product.sale_price ? +product.sale_price : +product.price);
      })
      return result.toLocaleString('ru') + ' ₽';
    }
  },
  methods: {
    getProductsByIds(cartData) {
      const productIds = cartData.filter(el => !el.optionId).map(el => el.id),
            options = cartData.filter(el => el.optionId && el.optionId).map(el => {
              return { id: el.id, optionId: el.optionId };
            })
      axios.get("/api/products/" + productIds, { params: { options } })
      .then(response => {
        this.products = response.data.map((product, index) => {
          if (this.hasProductOption(product.options)) {
            const productOption = product.options[0];
            product.optionId = productOption.id;
            product.amount = this.findAmountByOptionId(cartData, productOption.id);
            product.price = productOption.price;
            product.sale_price = productOption.sale_price;
            product.title = product.title + ' - ' + productOption.product_option.name + ' ' + productOption.option_value.name;
          } else {
            product.amount = this.findAmountById(cartData, product.id);
          }
          product.index = index + '-' + product.id;
          return product;
        })
      })
      .catch(err => {
        console.log(err);
      })
    },
    findAmountById(array, id) {
      return array.find(el => +el.id == +id).amount
    },
    findAmountByOptionId(array, optionId) {
      return array.find(el => +el.optionId == +optionId).amount
    },
    hasProductOption(options) {
      return options && options.length > 0;
    },
    init() {
      const cartStorage = localStorage.getItem(process.env.MIX_STORE);
      if (cartStorage) {
        const cartData = JSON.parse(cartStorage);
        this.getProductsByIds(cartData);
      }
    },
    changeAmount(data) {
      const prepareData = { id: data.id, amount: data.amount, optionId: data.optionId };
      this.products = this.products.map(product => {

        if (data.optionId) {
          if (Number(data.optionId) === Number(product.optionId)) {
            prepareData.amount = Number(data.amount) - Number(product.amount);
            product.amount = data.amount;
          }
        } else {
          if (Number(data.id) == Number(product.id)) {
            prepareData.amount = Number(data.amount) - Number(product.amount);
            product.amount = data.amount;
          }
        }
        return product;
      })
      const cart = new Cart(".js-cart", ".js-cart-count");
      cart.addToCart(prepareData);
    },

    deleteProduct(data) {
      let productIndex = -1;
      productIndex = this.products.findIndex(el => el.index === data.index);
      if (productIndex !== -1) {
        this.products.splice(productIndex, 1);
      }
      const cart = new Cart(".js-cart", ".js-cart-count");
      cart.removeFromCart(productIndex);
    },
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener('change-cart-storage', (event) => {
      if (event.detail.storage) {
        const cartData = JSON.parse(event.detail.storage);
        this.getProductsByIds(cartData);
      }
    });
  }
}
</script>
