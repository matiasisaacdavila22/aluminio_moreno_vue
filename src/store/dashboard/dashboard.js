import axios from 'axios';
import Vue from 'vue';

export default {
    namespaced: true,

      state: {

        cardList: [
          {
            title: 'Productos',
            totalEvents: 0,
            icon: 'date_range',
            active: false,
           // to: '#/events'
          },
          {
            title: 'Puertas',
            totalEvents: 0,
            caption: '',
            icon: 'contact_mail',
             active: false,
          },
          {
            title: 'Ventas',
            totalEvents: 0,
            caption: '',
            icon: 'checklist_rtl',
             active: false,
          },
           {
            title: 'Compras',
            totalEvents: 0,
            caption: '',
            icon: 'question_answer',
             active: false,
           }
        ],
      },

      mutations: {

        SET_PRODUCTS_TOTAL(state, payload = 0){
          state.cardList[0].totalEvents = payload;
        },

        SET_CATEGORIES_TOTAL(state, payload = 0){
          state.cardList[1].totalEvents = payload;
        },

        SET_SALES_TOTAL(state, payload = 0){
          state.cardList[2].totalEvents = payload;
        },
        
      },

      actions: {

        SET_PRODUCTS_TOTAL(context, payload){
          context.commit('SET_PRODUCTS_TOTAL', payload)
        },

        SET_CATEGORIES_TOTAL(context, payload){
          context.commit('SET_CATEGORIES_TOTAL', payload)
        },

        SET_SALES_TOTAL(context, payload){
          context.commit('SET_SALES_TOTAL', payload)
        }

      },

      getters: {
        getCardList(state, getters){
          return state.cardList;
          },

      }
    }   