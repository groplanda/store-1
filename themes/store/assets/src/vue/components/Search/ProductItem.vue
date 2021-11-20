<template>
  <div class="category__item">
    <div class="product-card">
      <div class="product-card__image">
        <picture class="product-card__picture">
          <source :srcset="product.image ? '/storage/app/media' + product.image : noImage" class="product-card__image-src" />
          <img :src="product.image ? '/storage/app/media' + product.image : noImage" :alt="product.title" class="product-card__image-src" />
        </picture>
        <span class="product-card__label product-card__label_hit" v-if="product.is_hit">
          <svg class="product-card__label-fire" width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.95941 13.3125C3.55878 13.3125 2.41316 12.8969 1.54628 12.075C0.48628 11.0694 0.10878 9.6775 0.10878 8.71C0.10878 7.03438 0.886905 6.1425 0.92003 6.10563L1.29378 5.68688L1.45253 6.22563C1.64253 6.86875 1.93066 7.36813 2.20066 7.73C2.17066 7.48188 2.15503 7.21375 2.17128 6.95313C2.24566 5.765 2.82441 4.9725 3.41128 4.26188C4.20566 3.29875 4.59253 2.4775 4.59253 1.75V0.894379L6.40191 3.04063C7.26191 4.17063 7.56878 5.39438 7.67628 6.19375L8.99441 4.4325L9.13066 5.12063C9.13378 5.13438 9.41003 6.52375 9.73003 7.68438C10.0019 8.6725 10.0038 10.2675 9.11316 11.5119C8.33566 12.5975 7.06878 13.2 5.34941 13.3019C5.21691 13.3088 5.08691 13.3125 4.95941 13.3125ZM1.08128 7.03188C0.91128 7.4 0.73378 7.96375 0.73378 8.71C0.73378 9.5475 1.06003 10.7525 1.97691 11.6213C2.79316 12.3963 3.91816 12.7488 5.31441 12.6781C6.83503 12.5875 7.94316 12.0725 8.60503 11.1481C9.36816 10.0825 9.36316 8.70563 9.12753 7.85063C8.94378 7.18313 8.77441 6.44313 8.66128 5.9225L7.06753 8.05125L7.10691 7.04688C7.10816 7.0275 7.16941 5.08063 5.91503 3.43188L5.12191 2.4925C4.95128 3.16 4.54941 3.865 3.89378 4.66063C3.35066 5.31813 2.85816 5.99063 2.79566 6.9925C2.74878 7.74688 3.02441 8.62 3.02691 8.62813L3.31066 9.51438L2.55003 8.97938C2.50691 8.94875 1.64128 8.3275 1.08128 7.03188Z" fill="#FA5934"/>
          </svg>
        </span>
      </div>
      <div class="product-card__group">
        <div class="product-card__content">
          <div class="product-card__name">{{ product.title }}</div>
          <div class="product-card__descr" v-html="product.description"></div>
        </div>
        <div class="product-card__footer">
          <div class="product-card__prices">
            <template v-if="product.sale_price > 0">
            <div class="product-card__current-price">
              {{ basePrice }}
              <span class="product-card__prices-descr">за 1 порцию</span>
            </div>
            <div class="product-card__old-price">
              {{ salePrice }}
            </div>
            </template>
            <div class="product-card__current-price" v-else>
              {{ basePrice }}
              <span class="product-card__prices-descr">за 1 порцию</span>
            </div>
          </div>

          <a v-if="hasOptions" :href="'/product/' + product.id" class="product-card__button button button_primary">
            <span class="product-card__button-value">Подробнее</span>
          </a>

          <template v-else>
            <button
              type="button"
              class="product-card__button button button_primary"
              :class="btnHideClass"
              @click="addToCart(1)"
              :data-product-id="product.id"
            >
              <span class="product-card__button-value">В корзину</span>
            </button>
            <div class="qty" :class="qtyShowClass">
              <button
                type="button"
                class="qty__btn qty__btn_remove"
                @click="addToCart(-1)"
                >
                <svg class="qty__btn-ico" width="8" height="3" viewBox="0 0 8 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.702813 0.0799997H7.30281V2.576H0.702813V0.0799997Z" fill="currentColor"/>
                </svg>
              </button>
              <div class="qty__val" data-js-action="qty-val">{{ amount }}</div>
              <button
                type="button"
                class="qty__btn qty__btn_add"
                @click="addToCart(1)"
              >
                <svg class="qty__btn-ico" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5459 6.8H7.29788V11H4.72988V6.8H0.481875V4.4H4.72988V0.199999H7.29788V4.4H11.5459V6.8Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
      <a :href="'/product/' + product.id" class="product-card__url"></a>
      <a
        href="#!"
        class="product-card__url product-card__url_quick"
        @click="quickView"
        data-js-action="open-modal"
        data-type-modal="single-product"
      >
      </a>
    </div>
  </div>
</template>
<script>

export default {
  name: "ProductItem",
  data() {
    return {
      noImage: '/themes/store/assets/images/no-image.jpg',
      amount: this.product.amount,
    }
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    isWish: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    basePrice() {
      let price = 0;
      price = this.product.price.toLocaleString('ru') + ' ₽';
      return price;
    },
    salePrice() {
      let sale = 0;
      sale = this.product.sale_price.toLocaleString('ru') + ' ₽';
      return sale;
    },
    hasOptions() {
      return this.product.options.length > 0
    },
    btnHideClass() {
      return {
        'product-card__button_hide': +this.amount > 0
      }
    },
    qtyShowClass() {
      return {
        'qty_show': +this.amount > 0
      }
    }
  },
  methods: {
    addToCart(val) {
      const currentAmount = this.amount;
      this.amount = Number(currentAmount) + Number(val);
      this.$emit("updateCart", { id: Number(this.product.id), amount: val })
    },
    quickView() {
      this.$emit("quickView", this.product.id);
    }
  }
}
</script>
