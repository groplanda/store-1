<template>
  <div class="checkout section">
    <div class="checkout__wrap wrap">
      <div class="checkout__heading">
        <h1 class="checkout__title">Оформление заказа</h1>
      </div>
      <div class="checkout__container">
        <div class="checkout__order">
          <div class="mini-cart">
            <div class="mini-cart__products" v-if="products.length">
              <SingleProduct
                v-for="product in products"
                :key="product.id"
                :product="product"
                @changeAmount="changeAmount"
                @deleteProduct="deleteProduct"
                :checkoutEl="true"
              />
            </div>
            <div class="mini-cart__empty-info" v-else>Ваша корзина пуста</div>
          </div>

          <form id="order" class="checkout__form" @submit.prevent="onCheckout">
            <div class="checkout__form-row">
              <div class="checkout__form-title">Введите ваши данные</div>
              <div class="checkout__form-group">
                <label class="checkout__form-label">ФИО<sub class="checkout__form-asterix">*</sub></label>
                <input type="text" v-model="form.user_name" class="checkout__form-input" />
                <div class="checkout__form-error" v-if="nameErr">{{nameErr}}</div>
              </div>
              <div class="checkout__form-group">
                <label class="checkout__form-label">Ваш телефон<sub class="checkout__form-asterix">*</sub></label>
                <input type="text" v-model="form.user_phone" class="checkout__form-input" v-mask="'+7 (###) ###-##-##'" />
                <div class="checkout__form-error" v-if="phoneErr">{{phoneErr}}</div>
              </div>
              <div class="checkout__form-group">
                <label class="checkout__form-label">Ваш email</label>
                <input type="text" v-model="form.user_email" class="checkout__form-input" />
                <div class="checkout__form-error" v-if="emailErr">{{emailErr}}</div>
              </div>
              <div class="checkout__form-group">
                <label class="checkout__form-label">Ваш адрес</label>
                <input type="text" v-model="form.user_address" class="checkout__form-input" />
                <div class="checkout__form-error" v-if="addressErr">{{addressErr}}</div>
              </div>
            </div>
            <div class="checkout__form-row">
              <div class="checkout__form-title">Выберите способ оплаты</div>
              <div class="checkout__form-group">
                <label class="radio">
                  <input type="radio" name="payment_type" value="1" v-model="form.user_payment" class="radio__input" />
                  <span class="radio__circle"></span>
                  <span class="radio__group">
                    <span class="radio__group-title">Картой</span>
                    <span class="radio__group-descr">Оплата при получении товара</span>
                  </span>
                </label>
              </div>
              <div class="checkout__form-group">
                <label class="radio">
                  <input type="radio" name="payment_type" value="2" v-model="form.user_payment" class="radio__input" />
                  <span class="radio__circle"></span>
                  <span class="radio__group">
                    <span class="radio__group-title">Наличными</span>
                    <span class="radio__group-descr">Оплата при получении товара</span>
                  </span>
                </label>
              </div>
              <div class="checkout__form-error" v-if="paymentErr">{{paymentErr}}</div>
            </div>
            <div class="checkout__form-row">
              <div class="checkout__form-title">Оставьте комментарий</div>
              <div class="checkout__form-group checkout__form-group_full">
                <label class="checkout__form-label">Ваш комментарий</label>
                <textarea v-model="form.user_comment" class="checkout__form-input checkout__form-input_textarea"></textarea>
                <div class="checkout__form-error" v-if="commentErr">{{commentErr}}</div>
              </div>
            </div>
          </form>

        </div>
        <Total />
      </div>
    </div>
    <div class="checkout__loading" v-if="loading">
      <div class="checkout__loading-wrap">
        <Loading />
        <div class="checkout__loading-msg">
          {{ submitStatus }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SingleProduct from './MiniCart/SingleProduct';
import Total from './Checkout/Total';
import Loading from './Loading/Loading';
import { checkErr, onValidate, createMessage } from "@/src/utils/index";
import axios from "axios";
export default {
  name: "CheckoutItem",
  components: {
    SingleProduct,
    Total,
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
        user_payment: null,
        user_sum: 0,
        user_promocode: null,
        products: []
      },
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
    
    products() {
      return this.$store.getters.getProducts;
    },

    loading() {
      return this.$store.getters.getLoading;
    },

    user() {
      return this.$store.getters.getUser
    }
  },
  watch: {
    user(value) {
      if(value) {
        this.fillUserData(value);
      }
    }
  },
  methods: {
    fillUserData(userData) {
      const USER_KEYS = ['id', 'name', 'email', 'phone', 'address'];
      USER_KEYS.forEach(key => {
        if (userData[key]) {
          this.form[`user_${key}`] = userData[key];
        }
      })
    },

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
    },

    async onCheckout() {
      this.errors = [];
      this.$store.dispatch('setLoading', true);
      this.submitStatus = 'Заказ отправляется...'

      this.form.products = this.products;
      this.form.user_sum = this.$store.getters.getTotal;

      const request = await axios.post('/api/add-order', this.form);
      const data = await request.data;
      let message = '';

      if (data.status === 'error') {

        this.onValidate(data);
        this.submitStatus = null;

      } else if (data.status === 'redirect') {

        message = 'Подготовка формы оплаты...';
        setTimeout(() => window.location.replace(data.message), 2000);

      } else if (data.status === 'success') {

        message = 'Подготовка формы оплаты...';
        message = data.message;
        setTimeout(() => {
          this.clearProductData();
          this.createRedirect(data.id);
        }, 2000);
      }
      this.submitStatus = message;
      this.$store.dispatch('setLoading', false);
    },

    onValidate(response) {
      this.errors = onValidate(response, this.form);
    },

    clearProductData() {
      this.resetForm();
      this.$store.dispatch('removeProducts')
    },

    createRedirect(id) {
      const url = new URL(process.env.MIX_URL + "/success-order");
      url.searchParams.set('id', id);
      window.location.href = url;
    },

    resetForm() {
      this.errors = [];
      this.submitStatus = null
      Object.keys(this.form).forEach(key => this.form[key] = '');
    },
  },
  created() {
    this.$store.dispatch('getUser');
  }
}
</script>
