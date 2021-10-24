<template>
  <form class="account__form" @submit.prevent="onEdit">
    <div class="account__form-row">
      <div class="account__form-group account__form-group_col">
        <label class="account__form-label">Имя и фамилия</label>
        <input type="text" class="account__form-input" v-model="form.name" placeholder="Иван Иванов" />
        <span class="account__form-error" v-if="nameErr">{{ nameErr }}</span>
      </div>
      <div class="account__form-group account__form-group_col">
        <label class="account__form-label">Отчество</label>
        <input type="text" class="account__form-input" v-model="form.surname" placeholder="Иванович" />
        <span class="account__form-error" v-if="surnameErr">{{ surnameErr }}</span>
      </div>
    </div>
    <div class="account__form-row">
      <div class="account__form-group account__form-group_col">
        <label class="account__form-label">Адрес электронной почты</label>
        <input type="text" class="account__form-input" v-model="form.email" placeholder="ivanov@yandex.ru" />
        <span class="account__form-error" v-if="emailErr">{{ emailErr }}</span>
      </div>
      <div class="account__form-group account__form-group_col">
        <label class="account__form-label">Номер телефона</label>
        <input type="text" class="account__form-input" v-model="form.phone" placeholder="+7 (___) ___ __-__" v-mask="'+7 (###) ###-##-##'" />
        <span class="account__form-error" v-if="phoneErr">{{ phoneErr }}</span>
      </div>
    </div>
    <div class="account__form-row account__form-row_last">
      <div class="account__form-group account__form-group_full">
        <label class="account__form-label">Стандартный адрес доставки</label>
        <input type="text" class="account__form-input" v-model="form.address" placeholder="г. Москва, ул. Пушкина д.1, кв. 1" />
         <span class="account__form-error" v-if="addressErr">{{ addressErr }}</span>
      </div>
    </div>
    <div class="account__form-row">
      <div class="account__form-group account__form-group_full">
        <label class="radio radio_edit">
          <input type="checkbox" name="is_subscribe" value="1" v-model="form.is_subscribe" class="radio__input" />
          <span class="radio__circle"></span>
          <span class="radio__group">
            <span class="radio__group-title">Хочу получать информацию о скидках и акциях</span>
          </span>
        </label>
      </div>
    </div>
    <button type="submit" class="button button_primary account__form-button">Изменить данные</button>
    <span class="account__form-response" v-if="submitStatus">{{ submitStatus }}</span>
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
  },
  methods: {
    fillUserData(userData) {
      const USER_KEYS = ['name', 'surname', 'phone', 'email', 'address', 'is_subscribe'];
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