import { computed } from 'vue';
import { useStore } from 'vuex';
import { auth } from "boot/firebase";
import { db } from "boot/firebase";

const modelComposable = () => {

    const store = useStore();
    let models = [];

    async function listModels() {
        try {
             var user = await auth.currentUser;
          const resDb = await db.collection('models').where("author", "==", user.uid).get();
          resDb.forEach(element => {
  
            const model = {
                    id: element.id,
                    name: element.data().name,
                    cost: element.data().cost,
                    factor: element.data().factor,
                    description: element.data().description,
                    activeFactor: element.data().activeFactor,
                    active: element.data().active,
               }
               models.push(model);  
          });
          return models;
        } catch (error) {
          console.log(error)
        }
      }

    return {

        //getProducts: computed( () => store.getters['products/products/getProducts']),
      //  products,
      listModels

   } 
}
export default modelComposable;