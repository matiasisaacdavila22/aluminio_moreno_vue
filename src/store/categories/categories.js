import axios from 'axios';

export default {
    namespaced: true,

      state: {
            categories: [],
      
            columnsCategories : [
                { name: 'name',required: true,label: 'Categoy',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'description', label: 'Descripcion', field: 'description', sortable: true, style: 'width: 10px' },
                { name: 'active', label: 'Active', field: 'active'},
                { name: 'actions', label: 'Actions', field: 'actions'}
              ],
              
       },

      mutations: {
        setCategories(state, payload = []) {
            state.categories = payload
        },

        addCategory(state, payload = []){
          state.categories.push(payload)
        }, 

        deleteCategory(state, id){
          const index = state.categories.findIndex(p => p.id === id);                       
          state.categories.splice(index,1);
        }, 
      },

      actions: {
           
            setCategories(context, payload) {
              context.commit('setCategories', payload)
             },

            addCategory(context, payload) {
                 context.commit('addCategory', payload)
            },

            deleteCategory(context, id) {
              context.commit('deleteCategory', id)
         }
      },

      getters: {

            getCategories(state, getters){
              return state.categories;
            },

            getNameCategories(state, getters){
              const names = [];
              state.categories.forEach(element => {
                names.push(element.name);
              });
              return names;
            }

      }
}    