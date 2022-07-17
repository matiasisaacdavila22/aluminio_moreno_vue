import { computed } from 'vue';
import { useStore } from 'vuex';
import { auth } from "boot/firebase";
import { db } from "boot/firebase";
import { mapState, mapActions, mapGetters } from "vuex";

const productComposable = () => {

    const store = useStore();
    let products = [];



    async function listProducts() {
        try {
             var user = await auth.currentUser;
             console.log(user.uid)
          const resDb = await db.collection('products').where("author", "==", user.uid).get();
          resDb.forEach(element => {
            let category = this.getCategories.filter(val => val.id == element.data().categoryId);
            let model = this.gettersModels.filter( val => val.id == element.data().modelId);
          
            const product = {
                id: element.id,
                name: element.data().name,
                category: category[0].name,
                description: element.data().description,
                stock: element.data().stock,
                cost: element.data().cost,
                price: element.data().price,
                stars: element.data().stars,
                active: element.data().active,
                model: model[0].name,
                images: element.data().images,
               }
               products.push(product);  
          });
          return products;
        } catch (error) {
          console.log(error)
        }
      }

    return {
        computed: {
            ...mapGetters("categories/categories", ["getCategories"]),
            ...mapGetters('models/models', ['gettersModels'])
        },
 
        //getProducts: computed( () => store.getters['products/products/getProducts']),
      //  products,
        listProducts

   } 
}
export default productComposable;