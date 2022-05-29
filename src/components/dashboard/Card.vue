<template>
  <div class="card_items" >
        <q-card
          class="card_my-card text-white"
          active-class="my-menu-link" 
          clickable          
          >
        
          <q-card-section>
         
            <div class="card_sections" >
              <div class="text-h5"><q-icon :name="icon"/></div>
              <div class="text-h7">{{title}}</div>
              <div class="text-subtitle2">{{caption}}</div>
            </div>
            
          </q-card-section>
              <q-separator dark inset />
          <q-card-section class="q-pt-none">
            {{ totalEvents }}
          </q-card-section>

        </q-card>
   </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',
  props: {

    totalEvents: {
      type: Number,
      required: true,
      default:0
    },
  
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

   link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
}
})
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Raleway;
}

</style>
