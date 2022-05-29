<template>
 <div class="q-pa-md row items-start q-gutter-md">
   <q-card class="my-card">
     <q-img  :src="product.images[0]"
        style="max-width: 300px; height: 300px;"
        fit="fill"
      />
      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="info"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-80%);"
          @click="productDescription(product)"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{product.category}}
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="info" />
           mas info ...
          </div>
        </div>
      <div class="text-subtitle1">
          ・{{product.name.slice(0,30)}}__  $ {{product.price}}
        </div>
               <div class="text-caption text-grey">
        {{ product.description.slice(0,80)}}
        </div>
        <q-rating class="absolute" v-model="product.stars" :max="5" size="32px" 
                  style="top: 0; right: 130px; transform: translateY(-100%);"/>
      </q-card-section>

      <q-separator />

    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState,mapMutations, mapGetters, mapActions } from 'vuex'
import ProductDescription from "src/components/products/ProductDescription.vue";

export default defineComponent({
  name: 'Product',

  data: function () {
    return {  
      showDescription: false,
    };
  },

  components: {
    ProductDescription,
  },

  computed: { //cada vez que la informacion del stado se actualize nuesta count se vuelve a generar 
      ...mapState('products/products',['count']), 
      ...mapGetters('products/products', ['getDouble']),
      
  },

  props: {
    product:{ type: Object, required: true},
    
  },
  
  methods: {
      ...mapMutations('products/products',['increment', 'decrement']),
       ...mapActions('products/products', ['incrementAsync']),



     productDescription (product) {
        this.$emit('showDescription', product);
     },

  },
   
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  min-width: 250px
  max-width: 350px
  height: 480px

.q-img  
  min-width: 250px
  max-width: 300px
  height: auto
  border-radius: 2px
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.5)
  transition: width 1s
  
</style>
