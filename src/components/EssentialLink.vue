<template>
  <q-item
    clickable
    to="#"
    active-class="my-menu-link"
    exact
  >
    <q-item-section
      v-if="icon"
      avatar
    >
    <q-icon :name="icon"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label caption>
        {{ description }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    name: {
      type: String,
      required: true
    },

    description: {
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

<style lang="sass">

</style>
