<template>
  <section class="checkout section">
    <div class="wrap checkout__wrap">
      <form class="checkout__row" @submit.prevent="onCheckout">
        <div class="checkout__col">
          <h1 class="title title_lg checkout__title">Оформление заказа</h1>
          <div class="checkout__step">
            <div class="checkout__step-heading">
              <div class="checkout__step-count">1</div>
              <div class="checkout__step-name">Контактные данные</div>
            </div>
            <div class="checkout__step-group checkout__step-group_full">
              <label class="checkout__step-label">Имя и фамилия</label>
              <input
                type="text"
                v-model="form.user_name"
                class="checkout__step-input"
                :class="{ 'checkout__step-input_error': nameErr }"
                placeholder="Иван Иванов"
              />
              <span class="checkout__step-error" v-if="nameErr">{{ nameErr }}</span>
            </div>
            <div class="checkout__step-row">
              <div class="checkout__step-group checkout__step-group_col">
                <label class="checkout__step-label">Адрес электронной почты</label>
                <input
                  type="text"
                  v-model="form.user_email"
                  class="checkout__step-input"
                  :class="{ 'checkout__step-input_error': emailErr }"
                  placeholder="ivanov@yandex.ru"
                />
                <span class="checkout__step-error" v-if="emailErr">{{ emailErr }}</span>
              </div>
              <div class="checkout__step-group checkout__step-group_col">
                <label class="checkout__step-label">Номер телефона</label>
                <input
                  type="text"
                  v-model="form.user_phone"
                  v-mask="'+7 (###) ###-##-##'"
                  :class="{ 'checkout__step-input_error': phoneErr }"
                  class="checkout__step-input"
                  placeholder="+7 (___) ___ __-__"
                />
                <span class="checkout__step-error" v-if="phoneErr">{{ phoneErr }}</span>
              </div>
            </div>
            <div class="checkout__step-group checkout__step-group_full">
              <label class="checkout__step-label">Адрес доставки</label>
              <input
                type="text"
                v-model="form.user_address"
                class="checkout__step-input"
                :class="{ 'checkout__step-input_error': addressErr }"
                placeholder="г. Москва, ул. Пушкина д.1, кв. 1"
              />
              <span class="checkout__step-error" v-if="addressErr">{{ addressErr }}</span>
            </div>
          </div>

          <div class="checkout__step checkout__step_last">
            <div class="checkout__step-heading">
              <div class="checkout__step-count">2</div>
              <div class="checkout__step-name">Способ оплаты</div>
            </div>

            <div class="checkout__step-payment">
              <label class="radio">
                <input type="radio" name="payment_type" value="0" checked v-model="form.user_payment" class="radio__input" />
                <span class="radio__circle"></span>
                <span class="radio__group">
                  <span class="radio__group-title">Онлайн оплата картой</span>
                  <span class="radio__group-descr">Visa, MasterCard, Maestro, Apple Pay, Samsung Pay</span>
                </span>
              </label>
              <label class="radio">
                <input type="radio" name="payment_type" value="1" v-model="form.user_payment" class="radio__input" />
                <span class="radio__circle"></span>
                <span class="radio__group">
                  <span class="radio__group-title">Оплата картой курьеру</span>
                  <span class="radio__group-descr">Visa, MasterCard, Maestro, Apple Pay, Samsung Pay</span>
                </span>
              </label>
              <label class="radio">
                <input type="radio" name="payment_type" value="2" v-model="form.user_payment" class="radio__input" />
                <span class="radio__circle"></span>
                <span class="radio__group">
                  <span class="radio__group-title">Оплата наличными курьеру</span>
                  <span class="radio__group-descr">Пожалуйста, укажите в комментарии к заказу, с какой купюры будет нужна сдача.</span>
                </span>
              </label>
              <span class="checkout__step-error" v-if="paymentErr">{{ paymentErr }}</span>
            </div>

            <div class="checkout__step-group checkout__step-group_full checkout__step-group_last">
              <label class="checkout__step-label">Комментарий к заказу</label>
              <textarea
                v-model="form.user_comment"
                class="checkout__step-input checkout__step-input_textarea"
                :class="{ 'checkout__step-input_error': commentErr }"
                placeholder="Дополнительная информация"></textarea>
              <span class="checkout__step-error" v-if="commentErr">{{ commentErr }}</span>
            </div>
          </div>

        </div>
        <div class="checkout__col">
          <div class="checkout__cart">
            <div class="title title_sm checkout__cart-title">Товары в корзине</div>
            <div class="checkout__cart-list" v-if="products">
              <CartItem
                v-for="product in products"
                :key="product.index"
                :product="product"
                @changeAmount="changeAmount"
                @deleteProduct="deleteProduct"
              />
            </div>
          </div>
          <Promocode :total="calculateTotal" @setPromo="setPromo" />
          <CartTotal :price="{ sum: calculateSum, total: calculateTotal, promocode: promocodeValue }"/>
        </div>
        <div class="checkout__footer">
          <button type="submit" class="button button_primary checkout__send">Оформить заказ</button>
          <p class="checkout__confirm">Оформляя заказ, вы принимаете условия
            <a href="/privacy" target="_blank" rel="noopener noreferrer" class="checkout__confirm-link">политики конфиденциальности</a>
          </p>
          <span class="checkout__response" v-if="submitStatus">{{ submitStatus }}</span>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { onValidate, checkErr } from "@/src/helpers/validate.js";
import axios from "axios";
import CartItem from "./components/Checkout/CartItem";
import CartTotal from "./components/Checkout/CartTotal";
import Promocode from "./components/Checkout/Promocode";
import { Cart } from '@/src/plugins/Cart';

export default {
  name: "App",
  components: {
    CartItem,
    CartTotal,
    Promocode
  },
  data() {
    return {
      form: {
        user_id: null,
        user_name: "",
        user_phone: "",
        user_email: "",
        user_address: "",
        user_comment: "",
        user_payment: 0,
        user_sum: 0,
        user_promocode: null,
      },
      products: [],
      promocodeValue: 0,
      submitStatus: null,
      errors: []
    }
  },
  computed: {
    nameErr() {
      return checkErr('user_name', this.errors);
    },

    phoneErr() {
      return checkErr('user_phone', this.errors);
    },

    addressErr() {
      return checkErr('user_address', this.errors);
    },

    emailErr() {
      return checkErr('user_email', this.errors);
    },

    commentErr() {
      return checkErr('user_comment', this.errors);
    },

    paymentErr() {
      return checkErr('user_payment', this.errors);
    },

    submitMsg () {
      return this.submitStatus;
    },

    calculateSum() {
      let result = 0;
      this.products.forEach(product => {
        result += Number(product.amount) * Number(product.price);
      })
      return result;
    },

    calculateTotal() {
      let result = 0;
      this.products.forEach(product => {
        result += Number(product.amount) * Number(+product.sale_price ? +product.sale_price : +product.price);
      })
      result -= this.promocodeValue;
      return result;
    }
  },
  methods: {
    onCheckout() {
      this.setSubmitStatus(null);
      this.errors = [];

      this.setSubmitStatus("Заказ отправляется...");
      this.form.products = this.products;
      this.form.user_sum = this.calculateTotal + this.promocodeValue;

      axios.post('/api/add-order', this.form)
        .then(response => {
          let message = ''
          const data = response.data;
          if(data.status === 'error') {
            this.onValidate(data)
            this.setSubmitStatus(null);

          } else if (data.status === 'redirect') {
            message = 'Подготовка формы оплаты...';
            this.clearProductData();
            setTimeout(() => {
              window.location.replace(data.message);
            }, 1500);

          } else if(data.status === 'success') {
            message = data.message;
            this.clearProductData();
            this.createRedirect(data.id);
          }

          this.setSubmitStatus(message);

        })
        .catch(error => {
          console.log(error);
        })
    },

    resetForm() {
      this.errors = [];
      this.setSubmitStatus(null);
      Object.keys(this.form).forEach(key => this.form[key] = '');
    },

    clearProductData() {
      this.resetForm();
      if (localStorage.getItem('shop_cart')) {
        localStorage.removeItem('shop_cart');
      }
    },

    onValidate(response) {
      this.errors = onValidate(response, this.form);
    },

    setSubmitStatus(status) {
      this.submitStatus = status;
    },

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
      if (data.optionId) {
        productIndex = this.products.findIndex(el => Number(el.id) === Number(data.id) && Number(el.optionId) === Number(data.optionId));
      } else {
        productIndex = this.products.findIndex(el => Number(el.id) === Number(data.id));
      }
      if (productIndex !== -1) {
        this.products.splice(productIndex, 1);
      }
      const cart = new Cart(".js-cart", ".js-cart-count");
      cart.removeFromCart(productIndex);

      if (this.products.length === 0) {
        window.location.href = "/";
      }
    },
    createRedirect(id) {
      const url = new URL(process.env.MIX_URL + "/success-order");
      url.searchParams.set('id', id);
      window.location.href = url;
    },
    getUserdata() {
      axios.get("/api/user/userdata")
      .then(response => {
        const data = response.data;
        if (response.status === 200 && data.status === "success") {
          this.fillUserData(data.user);
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          console.log('403');
        }
        if (error.response.status === 500) {
          console.log('500');
        }
      })
    },
    fillUserData(userData) {
      const USER_KEYS = ['id', 'name', 'email', 'phone', 'address'];
      USER_KEYS.forEach(key => {
        if (userData[key]) {
          this.form[`user_${key}`] = userData[key];
        }
      })
    },
    isUserLogin() {
      axios.get("/api/user/isUserLogin")
      .then(response => {
        if (response.data) {
          this.getUserdata();
        }
      })
    },
    setPromo(promocode) {
      this.form.user_promocode = promocode.id;
      this.promocodeValue = promocode.value;
    }
  },
  created() {
    const cartStorage = localStorage.getItem('shop_cart');
    if (!cartStorage) {
      window.location.href = "/";
      return;
    }
    const cartData = JSON.parse(cartStorage);
    this.getProductsByIds(cartData);
    this.isUserLogin();
  }
}
</script>
