<template>
    <div id="app">
        <Header/>
        <div id="myApp" class="container">
            <LoadingBar v-if="isLoading"/>
            <router-view/>
        </div>
        <Footer/>
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import LoadingBar from "@/components/LoadingBar.vue"
import axios from 'axios'

export default {
    components: {
        Header,
        Footer,
        LoadingBar
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

    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: "Segoe UI", serif;
    margin: 0px;
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
    border: none;
    border-radius: 5px;
    background-color: #fff;
}

.button-primary {
    background-color: #0f8aa0;
    height: 2.5rem;
    color: #fff;
    /* margin: 1rem 0; */
    font-weight: 500;
}

.disabled {
    opacity: .7;
    cursor: default;
}

</style>
