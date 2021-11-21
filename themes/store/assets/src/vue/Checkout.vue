<template>
  <section class="checkout section">
    <div class="wrap checkout__wrap">
      <form class="checkout__row form" @submit.prevent="onCheckout">
        <div class="checkout__col">
          <h1 class="title checkout__title">Оформление заказа</h1>
          <div class="checkout__step checkout__step_last">
            <div class="checkout__step-heading">
              <div class="checkout__step-count">1</div>
              <div class="checkout__step-name">Выбор доставки</div>
            </div>

            <div class="checkout__step-payment">
              <label class="radio">
                <input type="radio" name="delivery_type" value="0" v-model="form.user_delivery" class="radio__input" :disabled="disableCourier" />
                <span class="radio__circle"></span>
                <span class="radio__group">
                  <span class="radio__group-title">Доставка курьером</span>
                  <span class="radio__group-descr">Доставка действует от суммы 600 руб.</span>
                </span>
              </label>
              <label class="radio">
                <input type="radio" name="delivery_type" value="1" v-model="form.user_delivery" checked class="radio__input" />
                <span class="radio__circle"></span>
                <span class="radio__group">
                  <span class="radio__group-title">Самовывоз</span>
                  <span class="radio__group-descr">Бесплатно</span>
                </span>
              </label>

              <span class="checkout__step-error" v-if="deliveryErr">{{ deliveryErr }}</span>
            </div>
          </div>
          <div class="checkout__step">
            <div class="checkout__step-heading">
              <div class="checkout__step-count">2</div>
              <div class="checkout__step-name">Контактные данные</div>
            </div>
            <div class="form__group">
              <label class="form__group-label">Имя и фамилия
                <span class="form__group-asterisk">*</span>
              </label>
              <input
                type="text"
                v-model="form.user_name"
                class="form__group-input"
                :class="{ 'form__group-input_error': nameErr }"
                placeholder="Иван Иванов"
              />
              <span class="form__group-error form__group-error_active" v-if="nameErr">{{ nameErr }}</span>
            </div>
            <div class="form__row">
              <div class="form__group form__group_col">
                <label class="form__group-label">Номер телефона
                  <span class="form__group-asterisk">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.user_phone"
                  v-mask="'+7 (###) ###-##-##'"
                  :class="{ 'form__group-input_error': phoneErr }"
                  class="form__group-input"
                  placeholder="+7 (___) ___ __-__"
                />
                <span class="form__group-error form__group-error_active" v-if="phoneErr">{{ phoneErr }}</span>
              </div>
              <div class="form__group form__group_col">
                <label class="form__group-label">Email</label>
                <input
                  type="text"
                  v-model="form.user_email"
                  class="form__group-input"
                  :class="{ 'form__group-input_error': emailErr }"
                  placeholder="ivanov@yandex.ru"
                />
                <span class="form__group-error form__group-error_active" v-if="emailErr">{{ emailErr }}</span>
              </div>
            </div>
            <div class="form__row" v-if="form.user_delivery == 0">
              <div class="form__group form__group_col">
                <label class="form__group-label">Адрес доставки
                  <span class="form__group-asterisk">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.user_address"
                  class="form__group-input"
                  :class="{ 'form__group-input_error': addressErr }"
                  placeholder="г. Москва, ул. Пушкина д.1"
                />
                <span class="form__group-error form__group-error_active" v-if="addressErr">{{ addressErr }}</span>
              </div>
              <div class="form__group form__group_sm">
                <label class="form__group-label">Подьезд
                  <span class="form__group-asterisk">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.user_entrance"
                  class="form__group-input"
                  :class="{ 'form__group-input_error': entranceErr }"
                  placeholder="3"
                />
                <span class="form__group-error form__group-error_active" v-if="entranceErr">{{ entranceErr }}</span>
              </div>
              <div class="form__group form__group_sm">
                <label class="form__group-label">Квартира
                  <span class="form__group-asterisk">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.user_flat"
                  class="form__group-input"
                  :class="{ 'form__group-input_error': flatErr }"
                  placeholder="17"
                />
                <span class="form__group-error form__group-error_active" v-if="flatErr">{{ flatErr }}</span>
              </div>
            </div>
          </div>

          <div class="checkout__step checkout__step_last">
            <div class="checkout__step-heading">
              <div class="checkout__step-count">3</div>
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

            <div class="form__group">
              <label class="form__group-label">Комментарий к заказу</label>
              <textarea
                v-model="form.user_comment"
                class="form__group-input form__group-input_textarea"
                :class="{ 'form__group_error': commentErr }"
                placeholder="Дополнительная информация"></textarea>
              <span class="form__group-error form__group-error_active" v-if="commentErr">{{ commentErr }}</span>
            </div>
          </div>

        </div>
        <div class="checkout__col">
          <div class="checkout__cart">
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
          <div class="checkout__cart" v-if="featuredProducts.length">
            <div class="title checkout__title">Рекомендуем:</div>
            <FeaturedProductItem v-for="product in featuredProducts" :key="product.id" :product="product" @changeAmount="changeFeaturedAmount" />
          </div>
          <Promocode :total="calculateTotal" @setPromo="setPromo" />
          <CartTotal :price="{ sum: calculateSum, total: calculateTotal, promocode: promocodeValue, sale: calculateSale, featured: calculateFeatured }"/>
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
    <div class="checkout__loading" v-if="loading">
      <div class="checkout__loading-wrap">
        <Loading :isWhite="true" />
        <div class="checkout__loading-msg">
          {{ submitStatus }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { onValidate, checkErr } from "@/src/helpers/validate.js";
import { Cart } from '@/src/plugins/Cart';
import axios from "axios";
import CartItem from "./components/Checkout/CartItem";
import CartTotal from "./components/Checkout/CartTotal";
import Promocode from "./components/Checkout/Promocode";
import FeaturedProductItem from "./components/Checkout/FeaturedProductItem";
import Loading from "./components/Loading/Loading";

export default {
  name: "App",
  components: {
    CartItem,
    CartTotal,
    Promocode,
    FeaturedProductItem,
    Loading
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
        user_delivery: 1,
        user_entrance: "",
        user_flat: "",
        user_promocode: null,
      },
      products: [],
      featuredProducts: [],
      promocodeValue: 0,
      submitStatus: null,
      errors: [],
      loading: false
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

    deliveryErr() {
       return checkErr('user_delivery', this.errors);
    },

    entranceErr() {
      return checkErr('user_entrance', this.errors);
    },

    flatErr() {
      return checkErr('user_flat', this.errors);
    },

    submitMsg () {
      return this.submitStatus;
    },

    calculateSum() {
      return this.products.reduce((sum, product) => sum + Number(product.amount) * Number(product.price), 0);
    },

    calculateWidthSale() {
      return this.products.reduce((sum, product) => sum + Number(product.amount) * Number(+product.sale_price ? +product.sale_price : +product.price), 0);
    },

    calculateTotal() {
      return this.calculateWidthSale - this.promocodeValue + this.calculateFeatured;
    },

    calculateSale() {
      return this.calculateSum - this.calculateWidthSale;
    },

    disableCourier() {
      return this.calculateTotal < 600
    },

    calculateFeatured() {
      let result = 0;
      this.featuredProducts.forEach(product => {
        if (product.currentPrice > 0) {
          if (product.max_free_quantity > 0) {
            result += ((Number(product.amount) - Number(product.max_free_quantity)) * Number(product.currentPrice));
          } else {
            result += Number(product.amount) * Number(product.currentPrice);
          }
        }
      })
      return result;
    },

    selectedFeaturedproducts() {
      return this.featuredProducts.filter(product => product.amount > 0);
    }
  },
  methods: {
    onCheckout() {
      this.setSubmitStatus(null);
      this.errors = [];
      this.loading = true;

      this.setSubmitStatus("Заказ отправляется...");
      this.form.products = this.products.concat(this.selectedFeaturedproducts);
      this.form.user_sum = this.calculateTotal + this.promocodeValue;

      axios.post('/api/add-order', this.form)
        .then(response => {
          let message = ''
          const data = response.data;
          if(data.status === 'error') {
            this.onValidate(data)
            this.setSubmitStatus(null);
            this.loading = false;

          } else if (data.status === 'redirect') {
            message = 'Подготовка формы оплаты...';
            this.clearProductData();
            setTimeout(() => {
              window.location.replace(data.message);
            }, 1500);

          } else if(data.status === 'success') {
            this.clearProductData();
            this.createRedirect(data.id);
          }

          this.setSubmitStatus(message);

        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        })
    },

    resetForm() {
      this.errors = [];
      this.setSubmitStatus(null);
      Object.keys(this.form).forEach(key => this.form[key] = '');
    },

    clearProductData() {
      this.resetForm();
      if (localStorage.getItem('sushi_shop')) {
        localStorage.removeItem('sushi_shop');
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
            product.price = Number(product.price);
            product.sale_price = Number(product.sale_price)
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
      if (this.disableCourier) this.form.user_delivery = 1;
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
      if (this.disableCourier) this.form.user_delivery = 1;
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
      const USER_KEYS = ['id', 'name', 'email', 'phone', 'address', 'entrance', 'flat'];
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
    },

    getFeaturedProducts() {
      axios.get("/api/featured-in-cart")
      .then(response => {
        const data = response.data;
        if (data.length === 0) return;
        this.featuredProducts = data.map(product => {
          return {
            ...product,
            amount: 0,
            price: Number(product.price),
            sale_price: Number(product.sale_price),
            max_free_quantity: Number(product.max_free_quantity),
            currentPrice: this.setDefaultPrice(product)
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
    },

    changeFeaturedAmount(data) {
      this.featuredProducts = this.featuredProducts.map(product => {
        if (Number(data.id) == Number(product.id)) {
          product.amount = data.amount;
          if (product.amount > product.max_free_quantity) {
            product.currentPrice = product.sale_price ? product.sale_price : product.price;
          } else {
            product.currentPrice = this.setDefaultPrice(product);
          }
        }
        return product;
      })
    },

    setDefaultPrice(product) {
      const { sale_price, price, max_free_quantity } = product;
      if (max_free_quantity > 0) return 0;
      return sale_price ? sale_price : price;
    }
  },
  created() {
    const cartStorage = localStorage.getItem('sushi_shop');
    if (!cartStorage) {
      window.location.href = "/";
      return;
    }
    const cartData = JSON.parse(cartStorage);
    this.getProductsByIds(cartData);
    this.isUserLogin();
    this.getFeaturedProducts();
  }
}
</script>
