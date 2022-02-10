import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue';
import Recipe from '@/views/recipes/Recipe.vue';
import RecipeForm from '@/views/recipes/RecipeForm.vue';
import MyProfile from '@/views/user/MyProfile.vue';
import EditMyProfile from '@/views/user/EditMyProfile.vue';
import CookBook from '@/views/recipes/CookBook.vue';

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home},
  { path: '/recipe/:id', component: Recipe},
  { path: '/recipeform/', component: RecipeForm},
  { path: '/recipeform/:id', component: RecipeForm},
  { path: '/myprofile', component: MyProfile},
  { path: '/editmyprofile', component: EditMyProfile},
  { path: '/cookbook', component: CookBook},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(router.history.pending);
  // next();
  if(router.history.pending.path != '/' && router.history.pending.path != '/recipe/'+router.history.pending.params.id){
    if(localStorage.getItem('token')){
      next();
    }else{
      next('/');
    }
  }else{
    next();
  }
  
});

export default router
