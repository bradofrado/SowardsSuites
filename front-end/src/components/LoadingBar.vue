<template>
    <div class="loader-container">
        <h1>Soward's Suites</h1>
        <div class="loader l-big"></div>
    </div>
</template>

<script>
export default {
    name: "LoadingBar",
    methods: {
        enableScrolling(scroll) {
            document.querySelector('body').style.overflow = scroll ? "auto" : "hidden";
        }
    },
    mounted () {
        this.enableScrolling(false);
    },
    destroyed() {
        this.enableScrolling(true);
    }
}
</script>

<style scoped>

.loader-container {
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translate(-50%);
    background-color: #fff;
    height: 100vh;
    z-index: 1;
}
</style>

<style>
.loader {
    border: 0px solid #f3f3f3;
    border-radius: 50%;
    border-top: 5px solid #0f8aa0;
    -webkit-animation: spin .8s linear infinite;
    animation: spin .8s linear infinite;
}

.l-big {
    height: 50px;
    width: 50px;
    border-width: 5px;
    margin: 30px auto;
}

.l-small {
    height: 20px;
    width: 20px;
    margin: auto;
    border-width: 1px;
}

/* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>