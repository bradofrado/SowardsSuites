<template>
    <div class="image-button-container">
        <router-link name="image-button" :class="'image-button center-center' + (img ? ' no-color' : '')" :to="to">            
            <div name="image-button-text" class="image-button-text center-center" >{{name}}</div>
        </router-link>
        <img v-if="img" :src="`/images/${img}`">
    </div>
</template>

<script>
export default {
    name: "ImageButton",
    props: {
        to: String,
        name: String,
        img: String
    }
}
</script>

<style scoped>
img {
    width: 100%;
}

.image-button-container {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    position: relative;
}

.image-button {
    position: relative;
    color: inherit;
    background-color: #999;
    transition: background-color .3s ease-in-out;
    width: 200px;
    height: 200px;
}

.no-color {
    background-color: rgb(255,255,255,0);
}

.no-color:hover {
    background-color: rgba(255, 255, 255, .25) !important;
}

.center-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.image-button-text {
    font-size: 2rem;
    color: #fff;
}

.image-button:hover {
    
    background-color: rgb(223, 222, 222);
    
    color: inherit;
    cursor: pointer;
    
}

@media only screen and (min-width: 960px) {
    .image-button, .image-button-container {
        /* width: 100%;
        height: 100%; */
        width: 300px;
        height: 300px;
    }

    .image-button-container {
        margin: 10px;
    }
}
</style>
