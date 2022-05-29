<template>
    <q-card class="my-card">
        <q-card-section class="row">
          <div class="text-h6">{{product.name}}</div>
          <q-space />
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon='close'
           />
        </q-card-section>
      <q-img :src= "product.images[0]" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="add_shopping_cart"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
          @click="addShoppingCart(product)"
        />

        <div class="row no-wrap items-center">
          <div class="col-auto text-weight text-h6 q-pt-md row no-wrap items-center">
            <q-icon name="attach_money" />{{product.price}}
          </div>
        </div>

        <q-rating v-model="product.stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-h6">
          {{product.category}}
        </div>
        <div class="text-subtitle1">
          {{product.description}}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>

      </q-card-actions>
    </q-card>
       <q-dialog v-model="showAutentication">
          <autentication-client @close='showAutentication = false'/>
     </q-dialog>
    
</template>

<script>
import { defineComponent } from 'vue';
import { mapState,mapMutations, mapGetters, mapActions } from 'vuex';
import AutenticationClient from '../../components/auth/AutenticationClient.vue';

export default defineComponent({
  name: 'Product',


 components: {
        AutenticationClient
       },

  data() {
    return {
      showAutentication: false,
    };
  },     

  computed: { //cada vez que la informacion del stado se actualize nuesta count se vuelve a generar 
      ...mapState('products/products',['count']), 
      ...mapGetters('products/products', ['getDouble']),

      ...mapState('auth/auth',['customer']),
      ...mapGetters('auth/auth', ['getCustomer']),
      
  },

  props: {
    product:{ type: Object, required: true},
    
  },
  
  methods: {
      ...mapMutations('products/products',['increment', 'decrement']),
      ...mapActions('products/products', ['incrementAsync']),
      ...mapActions('cart/cart',['ADD_PRODUCT_CART', 'deleteCartPoduct']),

     addShoppingCart(product){
       if(this.getCustomer){
       product.quantity = 1;
       this.ADD_PRODUCT_CART(product);
       this.$emit('close');
                     this.$q.notify({
                     message: 'Event saved successfully!',
                     type: 'positive',
                     position: 'top-right',
                     timeout: 1000,
                 }) 
         }else{
 
           this.showAutentication = true;
         }
 
     },
  },
   
})
</script>

<style lang="sass" scoped>
.my-card
  width: 700px
  max-width: 500px
</style>