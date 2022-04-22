<template>
  <div class="category__item">
    <div class="product-item" :data-product-index="product.id">
      <div class="product-item__top">
        <div class="product-item__tags">
          <div class="product-item__tag product-item__tag--new" v-if="+product.is_new">New</div>
          <div class="product-item__tag product-item__tag--hit" v-if="+product.sale_price">Хит</div>
          <div class="product-item__tag product-item__tag--sale" v-if="salePercent">
            -{{ salePercent }}%
          </div>
        </div>
        <div class="product-item__image">
          <a :href="'/product/' + product.id" class="product-item__link">
            <picture>
              <source :srcset="product.image ? '/storage/app/media' + product.image : noImage">
              <img
                :src="product.image ? '/storage/app/media' + product.image : noImage"
                :alt="product.title"
                class="product-item__image-thumb" />
            </picture>
          </a>
        </div>
      </div>
      <div class="product-item__bottom">
        <div class="product-item__info">
          <a :href="'/product/' + product.id" class="product-item__title">{{ product.title }}</a>
          <a
            v-if="hasCategory"
            :href="'/category/' + product.categories[0].slug"
            class="product-item__category"
          >
            {{ product.categories[0].title}}
          </a>
        </div>
        <div class="product-item__amount">
          <div class="product-amount" data-js-action="update-qty">
            <button type="button" class="product-amount__btn" @click="changeCount" data-type="minus">
              <svg class="product-amount__btn-ico icon-minus">
                <use :xlink:href="spritePath + '#sprite-minus'"></use>
              </svg>
            </button>
            <input
              type="number"
              readonly="readonly"
              class="product-amount__val"
              value="1"
              v-model="count"
              data-js-action="qty-val"
            />
            <button type="button" class="product-amount__btn" @click="changeCount" data-type="plus">
              <svg class="product-amount__btn-ico icon-plus">
                <use :xlink:href="spritePath + '#sprite-plus'"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="product-item__cart">
          <div class="product-item__price">

            <template v-if="product.sale_price > 0">
            <div class="product-item__current-price">
              <strong class="product-item__price-val">{{ salePrice }}</strong>
              <span class="product-item__price-label">₽</span>
            </div>
            <div class="product-item__old-price">
              <strong class="product-item__price-val">{{ basePrice }}</strong>
              <span class="product-item__price-label">₽</span>
            </div>
            </template>
            <div class="product-item__current-price" v-else>
              <strong class="product-item__price-val">{{ basePrice }}</strong>
              <span class="product-item__price-label">₽</span>
            </div>

          </div>
          <button
            type="button"
            class="product-item__order-btn"
            @click="addToCart"
          >
            <svg class="product-item__order-ico icon-shopping-cart">
              <use :xlink:href="spritePath + '#sprite-shopping-cart'"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Cart } from "@/src/plugins/Cart";
import { createMessage } from '@/src/utils/index';

export default {
  name: "ProductItem",
  props: {
    product: {
      type: Object,
      required: true
    },
    isWish: {
      type: Boolean,
      default: false
    },
    currency: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      count: 1
    }
  },
  computed: {
    productClass() {
      return {
        category__item_default: !this.isWish,
        category__item_catalog: this.isWish
      };
    },
    basePrice() {
      let price = 0;
      price = (this.product.price * this.currency).toLocaleString("ru");
      return price;
    },
    salePrice() {
      let sale = 0;
      sale = (this.product.sale_price * this.currency).toLocaleString("ru");
      return sale;
    },
    hasOptions() {
      return this.product.options.length > 0;
    },
    salePercent() {
      let sale = 0;
      if (+this.product.sale_price) {
        sale = (100 - (+this.product.sale_price / +this.product.price * 100)).toFixed();
      }
      return sale;
    },
    hasCategory() {
      return this.product.categories[0];
    },
    spritePath() {
      return this.$sprite_path;
    }
  },
  methods: {
    addToCart() {
      const cart = new Cart(".js-cart-count");
      const result = cart.addToCart({
        id: Number(this.product.id),
        amount: this.count,
        optionId: null
      });
       createMessage(result);
      this.count = 1;
    },
    changeCount(e) {
      const type = e.target.dataset.type;
      if (type === "plus") {
        this.count++
        return
      }
      if (this.count > 1) {
        this.count--
      }
    }
  }
};
</script>
