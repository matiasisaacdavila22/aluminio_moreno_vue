import Vue from 'vue';

export default {
    namespaced: true,

      state: {
            products: ['casa','perro', 'melon'],
      

            columns : [
                { name: 'name',required: true,label: 'Product',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'model',required: true,label: 'Model',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
                { name: 'description', label: 'Descripcion', field: 'description', sortable: true, style: 'width: 10px' },
                { name: 'cost', label: 'Costo', field: 'cost', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'price', label: 'Precio ($)', field: 'price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'stock', label: 'Stock', field: 'stock', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'stars', label: 'Stars', field: 'stars', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'active', label: 'Active', field: 'active'},
                { name: 'actions', label: 'Actions', field: 'actions'}
              ],
              
               count: 45,

               searchProducts: [],

 },

      mutations: {
        setProducts(state, payload = []) {
            state.products = payload
        },

        setSearchProducts(state, payload = []) {
          state.searchProducts = payload
        },

        setProductsByCategory(state, payload = []) {
          console.log(payload)
          if(payload.category == undefined){
              state.searchProducts = state.products;
          }else{
            let searchProducts = state.products.filter(element => element.category == payload.category);
            console.log(searchProducts)
            state.searchProducts = searchProducts;
          }

        },
 
        addProduct(state, payload = []){
          state.products.push(payload)
        }, 

        deleteProduct(state, id){
          const index = state.products.findIndex(p => p.id === id);                       
          state.products.splice(index,1);
    }, 



      /////////////////////////////////////
        increment(state, payload = {}) {
          state.count += payload.number || 1
      },

      decrement(state, payload = {}) {
              state.count -= payload.number || 1
          },
      /////////////////////////////////////////////     
      },

      actions: {
            incrementAsync(context, payload) {
                setTimeout( () => {
                    context.commit('increment', payload)
                }, 2000)
            },
           
            setProducts(context, payload) {
              context.commit('setProducts', payload)
             },

            setSearchProducts(context, payload) {
              context.commit('setSearchProducts', payload)
             },

             setProductsByCategory(context, payload) {
              context.commit('setProductsByCategory', payload)
             },

            addProduct(context, payload) {
                 context.commit('addProduct', payload)
            },

            deleteProduct(context, id) {
              context.commit('deleteProduct', id)
         }
      },

      getters: {
            getDouble(state, getters) {
                return state.count * 2
            },

            getProducts(state, getters){
              return state.products;
            },

            getSearchProducts(state, getters){
              return state.searchProducts;
            },

            getProductsByCategory:(state, getters) => (category) => {
              console.log(category);
            },

      }
    }   