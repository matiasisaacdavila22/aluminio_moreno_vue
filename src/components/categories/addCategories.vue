<template>
   <q-card class="formulario">
        <q-card-section class="row">
          <div class="text-h6">Agregar Categoria</div>
          <q-space />
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon='close'
           />
        </q-card-section>

    <form @submit.prevent="submitForm" >
         <q-card-section class="q-pt-none">
           <div class="column full-width">
             <div>
                  <q-input outlined v-model="categoryToSubmit.name" label="Name" :rules="[val => !!val || 'Field is required']" ref="name"/>
             </div>
            <div>    
              <q-input type="textarea" outlined v-model="categoryToSubmit.description" label="Description" :rules="[val => !!val || 'Field is required']" ref="description"/>
            </div>
            <div>
              <q-toggle
                label="Active"
                v-model="categoryToSubmit.active"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
              />
            </div>
          </div>   

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="SAVE" color="primary" type="submit" />
        </q-card-actions>
    </form>


      </q-card>
</template>

<script>
import {db} from "boot/firebase";
import { mapActions } from 'vuex'
import { auth } from 'boot/firebase'
import { ref } from 'vue';

export default {
       data() {
            return {
                categoryToSubmit: {
                     name: '',
                     description: '',
                     active: true,
                     author: '',          
                },
               
            }
        },

      setup () {
        return {

        }
      },
       
      created(){
        var user = auth.currentUser;
       this.categoryToSubmit.author = user;
       console.log(user.uid)
      }, 
    
        methods: {
            ...mapActions('categories/categories', ['addCategory']),

            submitForm() {
                console.log('submitFom')
                this.$refs.name.validate()
                this.$refs.description.validate()
                 if(!this.$refs.name.hasError && !this.$refs.description.hasErrors){
                    var user = auth.currentUser;
                    this.categoryToSubmit.author = user.uid;
                    this.submitCategory();
                }
            }, 

          async submitCategory(){
              try {
                   const query = await db.collection('categories').add(
                     this.categoryToSubmit
                 )
                 .then( (res) => {
                   this.categoryToSubmit.id = res.id;
                   this.addCategory(this.categoryToSubmit)
                   console.log(res.id)
                   this.$emit('close');
                  })
                  .then( res => {
                  this.$q.notify({
                   message: 'Category saved successfully!',
                   type: 'positive',
                   position: 'top-right',
                 })
                 
                  })
                  }catch (error) {
                 console.log(error)
               } 
             }        
          }
    }
</script>
             
<style>
@media screen and (min-width: 300px), print {

  .formulario {
    width: 90%;
  }

} 
@media screen and (min-width: 450px), print {

      .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

     .item {
         width : 45%;
         margin: 5px;
      }
} 

@media screen and (min-width: 769px), print {
 
 
}

</style>