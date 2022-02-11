<template>
  <div class="category__item">
    <div class="product-item" :data-product-index="product.id">
      <input type="hidden" :value="product.id" />
      <div class="product-item__top">
        <div class="product-item__tags">
          <div class="product-item__tag product-item__tag--new" v-if="+product.is_new">New</div>
          <div class="product-item__tag product-item__tag--new" v-if="+product.sale_price">Sale</div>
        </div>
        <div class="product-item__image">
          <a :href="'/product/' + product.id" class="product-item__link">
            <img
              :src="product.image ? '/storage/app/media' + product.image : noImage"
              :alt="product.title"
              class="product-item__image-thumb"
            />
          </a>
        </div>
        <div class="product-item__order">
          <button type="button" class="product-item__order-btn" @click="addToCart">
            <svg viewBox="0 0 16 16" class="product-item__order-ico icon-cart">
              <path
                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="product-item__bottom">
        <a
          :href="'/product/' + product.id"
          class="product-item__title"
        >
          {{ product.title }}
        </a>
        <!---->
        <div class="product-item__code" v-if="product.code">Артикул: {{ product.code }}</div>
        <div class="product-item__cart">
          <div class="product-item__amount">
            <div class="product-amount" data-js-action="update-qty">
              <button
                type="button"
                class="product-amount__btn"
                data-type="minus"
                @click="changeCount"
              >
                <svg viewBox="0 0 12 2" class="product-amount__btn-ico icon-minus">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 1a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z"
                  />
                </svg>
              </button>
              <input type="number" readonly="readonly" class="product-amount__val" v-model="count" data-js-action="qty-val" />
              <button type="button" class="product-amount__btn" @click="changeCount" data-type="plus">
                <svg viewBox="0 0 12 12" class="product-amount__btn-ico icon-plus">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7 1a1 1 0 0 0-2 0v4H1a1 1 0 0 0 0 2h4v4a1 1 0 1 0 2 0V7h4a1 1 0 1 0 0-2H7V1z"
                  />
                </svg>
              </button>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Cart } from "@/src/plugins/Cart";

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
      price = this.product.price.toLocaleString("ru");
      return price;
    },
    salePrice() {
      let sale = 0;
      sale = this.product.sale_price.toLocaleString("ru");
      return sale;
    },
    hasOptions() {
      return this.product.options.length > 0;
    }
  },
  methods: {
    addToCart() {
      const cart = new Cart(".js-cart", ".js-cart-count");
      cart.addToCart({
        id: Number(this.product.id),
        amount: this.count,
        optionId: null
      });
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
