import axios from 'axios';

export default {
    namespaced: true,

      state: {
            models: [],
      
            columnsModels : [
                { name: 'name',required: true,label: 'MODELO',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'cost', label: 'COSTO', field: 'cost', sortable: true, style: 'width: 10px' },
                { name: 'factor', label: 'FACTOR', field: 'factor', sortable: true, style: 'width: 10px' },
                { name: 'description', label: 'DESCRIPCION', field: 'description', sortable: true, style: 'width: 10px' },       
                { name: 'activeFactor', label: 'ACTIVE-FACTOR', field: 'activeFactor'},
                { name: 'active', label: 'ACTIVE', field: 'active'},
                { name: 'actions', label: 'ACTIONS', field: 'actions'}
              ],

           factores: [
             "Metro",
             "Peso"
           ]   
              
       },

      mutations: {
        setModels(state, payload = []) {
            state.models = payload
        },

        addModel(state, payload = []){
          state.models.push(payload)
        }, 

        deleteModel(state, id){
          const index = state.models.findIndex(p => p.id === id);                       
          state.models.splice(index,1);
        }, 
      },

      actions: {
           
            setModels(context, payload) {
              context.commit('setModels', payload)
             },

            addModel(context, payload) {
                 context.commit('addModel', payload)
            },

            deleteModel(context, id) {
              context.commit('deleteModel', id)
         }
      },

      getters: {

            getModels(state, getters){
              return state.models;
            },

            getNameModels(state, getters){
              const names = [];
              state.models.forEach(element => {
                names.push(element.name);
              });
              return names;
            },

            getFactores(state, getters){
              return state.factores;
            }

      }
}    