<template>
   <q-card class="formulario">
        <q-card-section class="row">
          <div class="text-h6">Agregar Modelo</div>
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
                  <q-input outlined v-model="modelToSubmit.name" label="Name" :rules="[val => !!val || 'Field is required']" ref="name"/>
             </div>
            <div>    
              <q-input type="textarea" outlined v-model="modelToSubmit.description" label="Description" :rules="[val => !!val || 'Field is required']" ref="description"/>
            </div>
            <div>
              <q-toggle
                label="Active"
                v-model="modelToSubmit.active"
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
                modelToSubmit: {
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
       this.modelToSubmit.author = user;
       console.log(user.uid)
      }, 
    
        methods: {
            ...mapActions('models/models', ['addModel']),

            submitForm() {
                console.log('submitFom')
                this.$refs.name.validate()
                this.$refs.description.validate()
                 if(!this.$refs.name.hasError && !this.$refs.description.hasErrors){
                    var user = auth.currentUser;
                    this.modelToSubmit.author = user.uid;
                    this.submitModel();
                }
            }, 

          async submitModel(){
              try {
                   const query = await db.collection('models').add(
                     this.modelToSubmit
                 )
                 .then( (res) => {
                   this.modelToSubmit.id = res.id;
                   this.addModel(this.modelToSubmit)
                   console.log(res.id)
                   this.$emit('close');
                  })
                  .then( res => {
                  this.$q.notify({
                   message: 'models saved successfully!',
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