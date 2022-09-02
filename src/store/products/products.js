import Vue from 'vue';

export default {
    namespaced: true,

      state: {
            products: [],
      
            filter: {
              query: '',
              filter: '',
              available: true
              },
      
            columns : [
                { name: 'name',required: true,label: 'Product',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'model',required: true,label: 'Model',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
                { name: 'description', label: 'Descripcion', field: 'description', sortable: true, style: 'width: 10px' },
                { name: 'cost', label: 'Costo', field: 'cost', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'price', label: 'Precio ($)', field: 'price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'stock', label: 'Stock', field: 'stock', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'amountMaterial', label: 'SIZE', field: 'amountMaterial'},
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

          SET_QUERY(state, payload) {
            state.filter.query = payload.query;
            state.filter.filter = payload.filter;
        },

        SET_AVAILABLE(state){
          state.filter.available = !state.filter.available;
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
         },

         SET_QUERY(context, payload) {
          context.commit('SET_QUERY', payload)
         },

         SET_AVAILABLE(context){
          context.commit('SET_AVAILABLE')
         },
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

            filteredProducts(state){
              let products = state.products; //.filter(product => product.active === state.filter.available);
                if(state.filter.query.length > 2 ){
                  if(state.filter.filter === 'category'){
                    return products.filter(element => element.category == state.filter.query);
                  }
                  if(state.filter.filter === 'amountMaterial'){
                      let preposiciones = ['de','desde', 'la', 'a', 'para', 'con', 'sin', 'ante', 'bajo', 'contra', 'sobre', 'tras', 'es', 'una', 'mi']
                      let tags = state.filter.query.split(' ');
                      let tagsList = [];
                      let products2 = [];
                      for(let i = 0; tags.length > i; i++){
                        if(tags[i] != '' && !(preposiciones.includes(tags[i]))){
                          tagsList.push(tags[i].toLowerCase());
                        }
                      } 
                      console.log('tagsList: ',tagsList)
                
                      for(let k = 0; products.length > k; k++){
                        let aux = 0;
  
                        for(let j = 0; tagsList.length > j; j++){
                            console.log('J:',j)
                            let amountMaterial = tagsList[j];
                            let nameSinS = amountMaterial.substring(-1, amountMaterial.length -1);
                            if(products[k].amountMaterial.toLowerCase().includes(amountMaterial) || (nameSinS.length > 2 && products[k].amountMaterial.toLowerCase().includes(nameSinS))){
                               if(j == 0){aux = aux +1}
                                  aux = aux +1; 
                              }   
                         }
                          if(aux > 0){
                            products[k].val = aux;
                            products2.push(products[k])
                          }
                         }
                       
                      console.log('productos2: ',products2)
                      products2.sort(function (a, b) {
                        if (a.val < b.val) {
                          return 1;
                        }
                        if (a.val > b.val) {
                          return -1;
                        }
                        // a must be equal to b
                        return 0;
                      });
                      return products2;
                     // return products.filter(product => product.name.toLowerCase().includes(name));
                  }else{
                    return products.filter(element => element.window);
                  }
    
                }
                return products;
            },

      }
    }   