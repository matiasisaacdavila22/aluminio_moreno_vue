<template>
   <q-card class="addProduct-container" >
       <q-card-section class="row">
          <div class="text-h6">Agregar Producto</div>
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
           <div> 
            <q-card-section class="container2">
         
              <div class="addProduct-container3">
                <div class="addProduct-item">
                      <q-input outlined v-model="productToSubmit.name" label="Name" :rules="[val => !!val || 'Field is required']" ref="name"/>
                </div>
                <div class="addProduct-item">
                    <q-input outlined v-model="productToSubmit.model" label="Model" :rules="[val => !!val || 'Field is required']" ref="model"/>
                </div>
                <div class="addProduct-item">   
                  <q-select outlined v-model="productToSubmit.category" :options="getNameCategories" label="Categories" :rules="[val => !!val || 'Field is required']" ref="category"/>
                  </div>
                <div class="addProduct-item">    
                  <q-input outlined v-model="productToSubmit.description" label="Description" :rules="[val => !!val || 'Field is required']" ref="description"/>
                </div>
                <div class="addProduct-item">    
                  <q-input outlined v-model="productToSubmit.cost" label="Cost" :rules="[val => !!val || 'Field is required' , val => (val > 0 && val < 100000) || 'Please type a number greater than zero']" ref="cost"/>
                </div>
                <div class="addProduct-item">  
                  <q-input outlined v-model="productToSubmit.price" label="Price" :rules="[val => !!val || 'Field is required' , val => (val > 0 && val < 100000) || 'Please type a number greater than zero']" ref="price"/>
                </div>
                <div class="addProduct-item">  
                  <q-input outlined v-model="productToSubmit.stock" label="Stock" :rules="[val => !!val || 'Field is required' , val => (val > 0 && val < 100000) || 'Please type a number greater than zero']" ref="stock"/>
                </div>
                <div class="addProduct-item">   
                  <q-input outlined v-model="productToSubmit.stars" label="Stars" :rules="[val => !!val || 'Field is required' , val => (val > 0 && val < 6) || 'Please type a number less than zero']" ref="stars"/>
                </div>
                <div class="addProduct-item">   
                  <q-input outlined v-model="productToSubmit.active" label="Active" />
                </div>  
           </div>
           <div class="addProduct-item1">
                       
              <q-uploader
                style="max-width: 250px; max-height: 100px"
                auto-upload
                hide-upload-btn = "false"
                label="Select to images MAX: 3"
                multiple 
                auto-expand
                max-files="3"
                accept=".jpg, image/*"
                @rejected="onRejected"
                @removed ="remove"
                :factory="factoryFn"
              >
              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm q-gutter-xs" >
                  <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
                    <q-tooltip>Clear All</q-tooltip>
                  </q-btn>
                  <q-btn v-if="scope.uploadedFiles.length > 0" icon="delete" @click="scope.removeUploadedFiles" round dense flat >
                    <q-tooltip>Remove Uploaded Files</q-tooltip>
                  </q-btn>
                  <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                  <div class="col">
                    <div class="q-uploader__title">Upload your files</div>
                    <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
                  </div>
                  <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                    <q-uploader-add-trigger />
                    <q-tooltip>Pick Files</q-tooltip>
                  </q-btn>
                  <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
                    <q-tooltip>Upload Files</q-tooltip>
                  </q-btn>

                  <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
                    <q-tooltip>Abort Upload</q-tooltip>
                  </q-btn>
                </div>
               </template>
             </q-uploader>
             </div>
         
           
        </q-card-section>

     </div>  
        <div>
            <q-card-actions align="center" class="btnSave">
              <q-btn  label="SAVE" color="primary" type="submit"  class="btn-save"/>
            </q-card-actions>
        </div>
    </form>


 
</q-card>
 

</template>

<script>
import { db, storage } from "boot/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { useQuasar } from 'quasar';
import { auth } from 'boot/firebase';

export default {
    
       setup () {
         const $q = useQuasar()

        function onRejected (rejectedEntries) {
          $q.notify({
            type: 'negative',
            message: `${rejectedEntries.length} file(s) did not pass validation constraints`
          })
        }

      return {
              model: ref(null),
              onRejected,
              filesMaxNumber: ref(null),
          }
       },

       data() {
            return {
                categoriesAux: [],

                productToSubmit: {               
                     name: '',
                     model:'',
                     category: '',
                     description: '',
                     cost: '',
                     price: '',
                     stock: '',
                     stars: '',
                     images: [],
                     active: true,          
                },
                images: [],
               
            }
        },
    
      created() {
          this.listCategories();
        },

        computed: {
              ...mapState('categories/categories',['categories']),
              ...mapGetters('categories/categories', ['getCategories', 'getNameCategories'])

            },

        methods: {
            ...mapActions('products/products', ['addProduct']),
            ...mapActions('categories/categories',['setCategories']),
   

        async listCategories() {
            try {
               if(this.getCategories.length <= 0){
              const resDb = await db.collection('categories').get();
              resDb.forEach(element => {
                const category = {
                        id: element.id,
                        name: element.data().name,
                        description: element.data().description,
                        active: element.data().active,
                  }
                this.categoriesAux.push(category);  
              });
            this.setCategories(this.categoriesAux);
               }
            } catch (error) {
              console.log(error)
            }
          },


            submitForm() {
                this.$refs.name.validate()
                this.$refs.model.validate()
                this.$refs.category.validate()
                this.$refs.description.validate()
                this.$refs.cost.validate()
                this.$refs.price.validate()
                this.$refs.stock.validate()
                this.$refs.stars.validate()
                if(!this.$refs.name.hasError 
                  && !this.$refs.category.hasError 
                  && !this.$refs.model.hasError 
                  && !this.$refs.description.hasError 
                  && !this.$refs.cost.hasError 
                  && !this.$refs.price.hasError 
                  && !this.$refs.stock.hasError 
                  && !this.$refs.stars.hasError){
                  this.upImages();  
                 }
            },
            
          async upImages(){
           try {
                for(let i = 0; this.images.length > i; i++){
                    const file = this.images[i];
                   //  filename + Date.now() + path.extname(file.originalname);
                   const name = file.name +Date.now();
                    await storage.ref().child('images/products').child(name).put(file)
                    const urlDescarga = await storage.ref().child('images/products').child(name).getDownloadURL()
                    this.productToSubmit.images.push(urlDescarga);
                }

                this.submitProduct();

             }catch (error) {
                 console.log(error)
               } 
          },  

          async submitProduct(){
              try { 
                     var user = await auth.currentUser;
                     this.productToSubmit.author = user.uid; 
                     const query = await db.collection('products').add(
                     this.productToSubmit
                 )
                 .then( (res) => {
                   this.productToSubmit.id = res.id;
                   this.addProduct(this.productToSubmit)
                   this.$emit('close');
                  })
                  .then( res => {
                  this.$q.notify({
                   message: 'Product saved successfully!',
                   type: 'positive',
                   position: 'top-right',
                 })
                 
                  })
                  }catch (error) {
                 console.log(error)
               } 
             },

          remove(file){
                try {
                  console.log(file[0].name)
                   console.log(this.images[0].name)
                   for(let i = 0; this.images.length > i; i++){
                     console.log(this.images[i].name)

                     if(this.images[i].name === file[0].name){
                          console.log('son inguales')
                            this.images.splice(i, 1);
                         }
                     }
             }catch (error) {
                 console.log(error)
               } 
             },

        
             factoryFn(files){      
                 try {
                     let aux = false;
                   for(let i = 0; this.images.length > i; i++){
                      aux = aux || (this.images[i].name == files[0].name);
                     }
                     if(!aux){
                         this.images.push(files[0]);
                     }
 
                  console.log(this.images)
             }catch (error) {
                 console.log(error)
               } 
             },  
          }
    }
</script>
             
<style>
@media screen and (min-width: 450px), print {
  
  
  .addProduct-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        width : 430px;
  }

  .container2 {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        width : 430px;
      }
      
  .addProduct-container3{
           display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width : 430px;
  }

  .addProduct-item1{
         width : 200px;
     
      }

  .addProduct-item{
       width : 180px; 
       margin: 5px;
   }  

   
  .btn-save{
    margin-bottom: 20px;
    width : 200px; 
    margin-left: -100px;

  }

} 
@media screen and (min-width: 700px), print {
  .addProduct-container{
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        max-width: 1000px;
        width : 600px;
  
  }

      .container2 {
            display: flex;
            flex-direction: row;
            width : 600px;
  
            
        
          }
      
                .addProduct-container3{
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      width : 300px;
                      border-radius: 10px;
                      border: 2px solid #73AD21;
                      padding: 3px;
                  }
                          .addProduct-item{
                              width : 140px; 
                              margin: 2px;
                          }  

                .addProduct-item1{
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      width : 230px;
                      margin: 2px;
                      border-radius: 10px;
                      border: 2px solid #73AD21;
                      padding: 2px;        
                  }

                .btn-save{
                      margin-bottom: 20px;
                      width : 100px; 
                     margin-right: 300px;

                     }   


} 

@media screen and (min-width: 769px), print {
 
 
}

</style>