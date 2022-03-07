<template>
    <div id="app">
        <Header/>
        <div id="myApp"><router-view/></div>
        <Footer/>
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
export default {
    components: {
        Header,
        Footer
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

</style>
