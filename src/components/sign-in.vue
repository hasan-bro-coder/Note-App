<template lang="">
  <div class="body">
    {{user}}
    <div class=" hidden p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 danger" role="alert">
  <span class="font-medium">Danger alert!</span> password must be over 6 characters
</div>
    <form class="max-w-sm mx-auto" @submit.prevent='sign($event)'>
  <div class="mb-5">
    <label for="email" class=" text-3xl block mb-2 font-medium text-gray-900 dark:text-white">Your email:</label>
    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
  </div>
  <div class="mb-5">
    <label for="password" class="block mb-2 text-3xl font-medium text-gray-900 dark:text-white">Your password:</label>
    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
  </div>
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</form>
  </div>
</template>
<script>
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tvfskypksxpqwurntbuc.supabase.co";
const supabaseKey = import.meta.env.PUBLIC_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export default {
  data() {
        return {
            user: {}
        }
    },
    async mounted(){
        const data = await supabase.auth.getUser();
        console.log(data)
        this.user = JSON.stringify(data)
    },
    methods:{
        async sign(event){
            let email = document.querySelector("#email").value,password = document.querySelector("#password").value;
            event.preventDefault();
            if (password.length < 6) {
                document.querySelector(".danger").style.display = "block";
                return 0
            }
let { data, error } = await supabase.auth.signUp({
  email,
  password
})


console.log(email,password,data,error)
    if (error) {
        document.querySelector(".danger").style.display = "block";
        document.querySelector(".danger").innerHTML = error.message;
        return 0
    }
    {
    let { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
if (error) {
        document.querySelector(".danger").style.display = "block";
        document.querySelector(".danger").innerHTML = error.message;
        return 0
    }
    }
    document.querySelector(".danger").style.display = "none";
    location.pathname = "/main"
    }
    },
};
</script>
<style lang="css">

    .body{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60vh;
        width: 100vw;
        flex-direction: column;
    }
     form{
        width: 50vw;
        height: 50vh;
        /* display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column; */
    } 
    /* form label{
        font-size: 20px;
    }
    form input{
        color: black;
        padding: 5px;
    }
    form div{
        margin-top: 10px;
    } */
</style>
