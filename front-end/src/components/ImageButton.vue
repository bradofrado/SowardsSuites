<template>
    <div class="image-button-container">
        <router-link v-if="to" name="image-button" :class="'image-button image-hover center-center' + (img ? ' no-color ' : '') + (className ? className : '')" :to="to">            
            <div name="image-button-text" class="image-button-text center-center" >{{name ? name : ''}}</div>
        </router-link>
        <button v-else-if="hasClick" name="image-button" :class="'image-button image-hover center-center' + (img ? ' no-color ' : '') + (className ? className : '')" @click="onClick">            
            <div name="image-button-text" class="image-button-text center-center" >{{name ? name : ''}}</div>
        </button>
        <div v-else :class="'image-button center-center' + (img ? ' no-color' : '')">
            <div class="image-button-text center-center" >{{name ? name : ''}}</div>
        </div>
        <img v-if="img" :src="img">
    </div>
</template>

<script>
export default {
    name: "ImageButton",
    props: {
        to: String,
        name: String,
        img: String,
        className: String
    },
    computed: {
        hasClick() {
            return this.$listeners && this.$listeners.click;
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
}
</script>

<style scoped>
img {
    width: 100%;
    border-radius: 50%;
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
    width: 100%;
    height: 100%;
    white-space: nowrap;
}

.no-color {
    background-color: rgb(255,255,255,0);
}

.no-color.image-hover:hover {
    background-color: rgba(255, 255, 255, .25) !important;
}

.center-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.image-button-text {
    font-size: 2em;
    color: #fff;
}

/* .image-button:hover {
    background-color: rgb(223, 222, 222);
    
    color: inherit;
    cursor: pointer;
} */

.image-hover:hover {
    background-color: rgb(223, 222, 222);
    
    color: inherit;
    cursor: pointer;
}

@media only screen and (min-width: 960px) {
    .image-button-container {
        width: 300px;
        height: 300px;
    }

    .image-button-container {
        margin: 10px;
    }
}
</style>
