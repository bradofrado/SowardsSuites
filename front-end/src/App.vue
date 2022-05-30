<template>
<div>
    <div id="app">
        <Header/>
        <div id="myApp" class="container">
            <LoadingBar v-if="isLoading"/>
            <router-view/>
        </div>
        <Footer/>
        
    </div>
    <modal-base ref='modal'></modal-base>
</div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import LoadingBar from "@/components/LoadingBar.vue"
import axios from 'axios'
import ModalBase from './components/ModalBase.vue'
//import ModalBase from './components/ModalBase.vue'

export default {
    components: {
        Header,
        Footer,
        LoadingBar,
        ModalBase,
        //ModalBase
    },
    async created() {
        try {
            let response = await axios.get('/api/users');
            this.$root.$data.user = response.data.user;
        } catch(error) {
            this.$root.$data.user = null;
        }
    },
    computed: {
        isLoading() {
            return this.$root.$data.isLoading;
        }
    }
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; 
  color: #2c3e50; */
}
html {
    font-size: 14px;
}

* {
    border: 0px solid #e2e8f0;
}

#app {
    /* background-color: #f7f7f7; */
    /* font-family: 'Montserrat' ,sans-serif; */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: "Segoe UI", serif;
    margin: 0px;
    color: #404452;
}

h1,h2,h3,h4,h5,h6 {
    text-align: center;
    margin: 10px 0;
}

h1 {
    font-weight: 300 !important;
    margin-bottom: 2rem;
}

.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    flex-wrap: nowrap;
}

#myApp {
    flex: 1;
    margin-top: 20px;
    margin-bottom: 20px;
}

/* img {
    width: 100%;
} */

button {
    cursor: pointer;
    border-radius: 5px;
    background-color: #fff;
}

.button {
    min-height: 40px !important;
    min-width: 75px;
}

.button .button-text {
    padding: 0px 5px;
    font-size: 12px;
}

.button-primary {
    background-color: #0f8aa0;
    /* height: 2.5rem; */
    color: #fff;
    /* margin: 1rem 0; */
    /* font-weight: 500; */
    border: none;
    /* max-width: 125px; */
    border-radius: .25rem;
}

.button-primary:hover {
    background-color: #19798a;
}

.button-secondary {
    /* margin: 0 5px; */
    border-radius: 0.25rem;
    border-width: 1px;
    background-color: #f7fafc;
    /* color: inherit; */
    font-weight: 500;
    color: #6a7383;
    text-decoration: none;
    min-height: 28px;
}

.button-secondary:hover {
    background-color: #f4f4f4;
}

.border {
    border-radius: 0.25rem;
    border-width: 1px;
    background-color: #f7fafc;
}

.disabled {
    opacity: .7;
    cursor: default;
}

.h-2 {
    height: 2.5rem;
}

.w-48 {
    width: 48% !important;
}

.ml-0 {
    margin-left: 5px;
}

.mw-125 {
    max-width: 125px;
}

.center {
    display: block;
    margin: 10px auto;
}

.popover-label {
    background-color: transparent;
    color: inherit;
    font-weight: inherit;
    display: inline-flex;
    align-items: center;
    padding: 0px;
}

.popover-label :first-child {
    margin-right: 5px;
}

.popover-label:hover {
    color: #b6b6b6;
}

.no-hover:hover {
    background-color: #f7fafc;
    cursor: default;
}

.error-text {
    display: inline;
    padding: 5px 20px;
    border-radius: 30px;
    font-size: 10px;
    background-color: #d9534f;
    color: #fff;
}
</style>
