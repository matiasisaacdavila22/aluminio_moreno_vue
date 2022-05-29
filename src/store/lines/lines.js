import axios from 'axios';

export default {
    namespaced: true,

      state: {
            lines: [],
      
            columnsLines : [
                { name: 'name',required: true,label: 'LINEA',align: 'left',field: row => row.name,format: val => `${val}`,sortable: true},
                { name: 'description', label: 'DESCRIPCION', field: 'description', sortable: true, style: 'width: 10px' },
                { name: 'active', label: 'ACTIVE', field: 'active'},
                { name: 'actions', label: 'ACTIONS', field: 'actions'}
              ],
              
       },

      mutations: {
        setLines(state, payload = []) {
            state.lines = payload
        },

        addLine(state, payload = []){
          state.lines.push(payload)
        }, 

        deleteLine(state, id){
          const index = state.lines.findIndex(p => p.id === id);                       
          state.lines.splice(index,1);
        }, 
      },

      actions: {
           
            setLines(context, payload) {
              context.commit('setLines', payload)
             },

            addLine(context, payload) {
                 context.commit('addLine', payload)
            },

            deleteLine(context, id) {
              context.commit('deleteLine', id)
         }
      },

      getters: {

            getLines(state, getters){
              return state.lines;
            },

            getNameLines(state, getters){
              const names = [];
              state.lines.forEach(element => {
                names.push(element.name);
              });
              return names;
            }

      }
}    