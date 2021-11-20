<template>
  <form class="form" @submit.prevent="onEdit">
    <div class="form__row">
      <div class="form__group form__group_col">
        <label class="form__group-label">Имя и фамилия</label>
        <input type="text" class="form__group-input" v-model="form.name" placeholder="Иван Иванов" />
        <span class="form__group-error" v-if="nameErr">{{ nameErr }}</span>
      </div>
      <div class="form__group form__group_col">
        <label class="form__group-label">Отчество</label>
        <input type="text" class="form__group-input" v-model="form.surname" placeholder="Иванович" />
        <span class="form__group-error" v-if="surnameErr">{{ surnameErr }}</span>
      </div>
    </div>
    <div class="form__row">
      <div class="form__group form__group_col">
        <label class="form__group-label">Email</label>
        <input type="text" class="form__group-input" v-model="form.email" placeholder="ivanov@yandex.ru" readonly />
        <span class="form__group-error" v-if="emailErr">{{ emailErr }}</span>
      </div>
      <div class="form__group form__group_col">
        <label class="form__group-label">Номер телефона</label>
        <input type="text" class="form__group-input" v-model="form.phone" placeholder="+7 (___) ___ __-__" v-mask="'+7 (###) ###-##-##'" />
        <span class="form__group-error" v-if="phoneErr">{{ phoneErr }}</span>
      </div>
    </div>
    <div class="form__row">
      <div class="form__group form__group_col">
        <label class="form__group-label">Адрес доставки</label>
        <input type="text" class="form__group-input" v-model="form.address" placeholder="г. Москва, ул. Пушкина д.1" />
         <span class="form__group-error" v-if="addressErr">{{ addressErr }}</span>
      </div>
      <div class="form__group form__group_sm">
        <label class="form__group-label">Подъезд</label>
        <input type="number" class="form__group-input" v-model="form.entrance" placeholder="1" />
         <span class="form__group-error" v-if="entranceErr">{{ entranceErr }}</span>
      </div>
      <div class="form__group form__group_sm">
        <label class="form__group-label">Квартира</label>
        <input type="number" class="form__group-input" v-model="form.flat" placeholder="12" />
         <span class="form__group-error" v-if="flatErr">{{ flatErr }}</span>
      </div>
    </div>
    <div class="form__row">
      <div class="form__group form__group_col">
        <label class="checkbox">
          <input type="checkbox" name="is_subscribe" value="1" v-model="form.is_subscribe" class="checkbox__input" />
          <span class="checkbox__square">
            <svg class="checkbox__ico" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5466 2.00008L11.1366 0.580078L4.54663 7.17008L1.96663 4.60008L0.546631 6.01008L4.54663 10.0001L12.5466 2.00008Z" fill="#E31E24"/>
            </svg>
          </span>
          <span class="checkbox__title">Хочу получать информацию о скидках и акциях</span>
        </label>
      </div>
    </div>
    <button type="submit" class="button button_primary form__submit">Изменить данные</button>
    <span class="form__done" v-if="submitStatus">{{ submitStatus }}</span>
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