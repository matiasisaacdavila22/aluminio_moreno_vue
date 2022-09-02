<template>
 <div class="q-pa-md row items-start q-gutter-md">
          <q-input type="text" dense outlined square v-model="search" placeholder="Search" class="bg-white col" style="top: 0; max-width: 100%; transform: translateY(-50%); border-radius: 3px 0 0 3px" />
          <q-btn class="GPLAY__toolbar-input-btn" color="primary" icon="search" unelevated style="top: 0; max-width: 10%; transform: translateY(-50%);  border-radius: 0 3px 3px 0" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState,mapMutations, mapGetters, mapActions } from 'vuex'



export default defineComponent({


  data: function () {
    return {  
 
    };
  },

  components: {
   
  },

  computed: { //cada vez que la informacion del stado se actualize nuesta count se vuelve a generar 
      ...mapState('products/products',['count', 'filter']), 
      ...mapGetters("products/products", ["getProducts", "getSearchProducts", "getProductsByCategory"]),

      search:{
        get () {
          return this.filter.query;
        },

        set (val) {
          this.search2( val );
        }
      },

      available: {
        get() {
          return this.filter.available;
        },

        set () {
          this.SET_AVAILABLE();
        }
      }
      
  },

  props: {
    product:{ type: Object, required: true},
    
  },
  
  methods: {
      ...mapActions('products/products', ['incrementAsync', 'SET_QUERY', 'SET_AVAILABLE']),

      search2(val){
        console.log('entre en search2 : ', val)
       
     let payload = {
           query: val,
           filter: 'amountMaterial' 
        }

        this.SET_QUERY(payload);
      }
  },
   
})
</script>

<style lang="sass" scoped>

</style>
