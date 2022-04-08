<template>
  <form class="contact-form" @submit.prevent="onChange">
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Текущий пароль</label>
        <input type="password" class="contact-form__form-input" v-model="form.current_password" placeholder="**********" />
        <span class="contact-form__error" v-if="currentPasswordErr">{{ currentPasswordErr }}</span>
      </div>
    </div>
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Новый пароль</label>
        <input type="password" class="contact-form__form-input" v-model="form.password" placeholder="**********" />
        <span class="contact-form__error" v-if="passwordErr">{{ passwordErr }}</span>
      </div>
    </div>
    <div class="contact-form__row">
      <div class="contact-form__form-group">
        <label class="contact-form__form-label">Подтвердите пароль</label>
        <input type="password" class="contact-form__form-input" v-model="form.password_confirmation" placeholder="**********" />
        <span class="contact-form__error" v-if="passwordConfirmationErr">{{ passwordConfirmationErr }}</span>
      </div>
    </div>
    <button type="submit" class="contact-form__btn">Изменить пароль</button>
    <input type="hidden" v-model="form.email" />
    <span class="contact-form__status" v-if="submitStatus">{{ submitStatus }}</span>
  </form>
</template>
<script>
import axios from "axios";
import { onValidate, checkErr } from "@/src/helpers/validate.js";
export default {
  name: "AccountChangePassword",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        current_password: "",
        password: "",
        password_confirmation: "",
        email: this.user.email,
      },
      errors: [],
      submitStatus: null
    }
  },
  computed: {
    currentPasswordErr() {
    return checkErr('current_password', this.errors);
    },
    passwordErr() {
      return checkErr('password', this.errors);
    },
    passwordConfirmationErr() {
      return checkErr('password_confirmation', this.errors);
    }
  },
  methods: {
    onChange() {
      this.errors = [];
      this.submitStatus = null;
      axios.post('/api/user/change-password', this.form)
      .then(response => {
        const data = response.data;
        if (data.status === 'error') {
          this.onValidate(data);
          return;
        }
        if (data.status === 'success') {
          this.submitStatus = data.message;
          this.resetForm();
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
    },
    resetForm() {
      this.errors = [];
      Object.keys(this.form).forEach(key => this.form[key] = '');
    }
  }
}
</script>
