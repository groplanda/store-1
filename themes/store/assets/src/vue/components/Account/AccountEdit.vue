<template>
  <form class="contact-form" @submit.prevent="onEdit">
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Имя и фамилия</label>
        <input type="text" class="contact-form__form-input" v-model="form.name" placeholder="Иван Иванов" />
        <span class="contact-form__error" v-if="nameErr">{{ nameErr }}</span>
      </div>
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Отчество</label>
        <input type="text" class="contact-form__form-input" v-model="form.surname" placeholder="Иванович" />
        <span class="contact-form__error" v-if="surnameErr">{{ surnameErr }}</span>
      </div>
    </div>
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Email</label>
        <input type="text" class="contact-form__form-input" v-model="form.email" placeholder="ivanov@yandex.ru" readonly />
        <span class="contact-form__error" v-if="emailErr">{{ emailErr }}</span>
      </div>
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Номер телефона</label>
        <input type="text" class="contact-form__form-input" v-model="form.phone" placeholder="+7 (___) ___ __-__" v-mask="'+7 (###) ###-##-##'" />
        <span class="contact-form__error" v-if="phoneErr">{{ phoneErr }}</span>
      </div>
    </div>
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Адрес доставки</label>
        <input type="text" class="contact-form__form-input" v-model="form.address" placeholder="г. Москва, ул. Пушкина д.1" />
         <span class="contact-form__error" v-if="addressErr">{{ addressErr }}</span>
      </div>
    </div>
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="radio radio_edit">
          <input type="checkbox" name="is_subscribe" value="1" v-model="form.is_subscribe" class="radio__input" />
          <span class="radio__circle"></span>
          <span class="radio__group">
            <span class="radio__group-title">Хочу получать информацию о скидках и акциях</span>
          </span>
        </label>
      </div>
    </div>
    <button type="submit" class="contact-form__btn">Изменить данные</button>
    <span class="contact-form__status" v-if="submitStatus">{{ submitStatus }}</span>
  </form>
</template>
<script>
import axios from "axios";
import { onValidate, checkErr } from "@/src/helpers/validate.js";
export default {
  name: "AccountEdit",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: "",
        surname: "",
        phone: "",
        email: "",
        address: "",
        entrance: "",
        flat: "",
        is_subscribe: false
      },
      errors: [],
      submitStatus: null
    }
  },
  computed: {
   nameErr() {
      return checkErr('name', this.errors);
    },
    surnameErr() {
      return checkErr('surname', this.errors);
    },
    phoneErr() {
      return checkErr('phone', this.errors);
    },
    emailErr() {
      return checkErr('email', this.errors);
    },
    addressErr() {
      return checkErr('address', this.errors);
    },
    entranceErr() {
      return checkErr('entrance', this.errors);
    },
    flatErr() {
      return checkErr('flat', this.errors);
    }
  },
  methods: {
    fillUserData(userData) {
      const USER_KEYS = ['name', 'surname', 'phone', 'email', 'address', 'entrance', 'flat', 'is_subscribe'];
      USER_KEYS.forEach(key => {
        if (userData[key]) {
          this.form[key] = userData[key];
        }
      })
    },
    onEdit() {
      this.errors = [];
      this.submitStatus = null;
      axios.post('/api/user/edit', this.form)
      .then(response => {
        const data = response.data;
        if (data.status === 'error') {
          this.onValidate(data);
          return;
        }
        if (data.status === 'success') {
          this.submitStatus = data.message;
          this.$emit("updateUser")
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
    onValidate(response) {
      this.errors = onValidate(response, this.form);
    }
  },
  mounted() {
    this.fillUserData(this.user);
  }
}
</script>
