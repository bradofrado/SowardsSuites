<template>
    <div :class="'image-button-container ' + activeClass">
        <button name="image-button" :class="'image-button center-center' + (img ? ' no-color' : '')" @click="$emit('click', id)">            
            <div name="image-button-text" class="image-button-text center-center" >{{name ? name : ''}}</div>
        </button>
        <img v-if="img" :src="img">
    </div>
</template>

<script>
export default {
    name: "ImageButton",
    props: {
        name: String,
        img: String,
        click: Function,
        active: Boolean,
        id: String
    },
    // data() {
    //     return {
    //         active: false
    //     }
    // },
    computed: {
        activeClass() {
            return this.$props.active ? 'active' : '';
        }
    },
    watch: {
        // active(newVal) {

        // }
    },
    // methods: {
    //     onClick() {
    //         this.active = !this.active;
    //         this.$emit('click', this.$props.id);
    //     }
    // }
}
</script>

<style scoped>
img {
    width: 100%;
    padding: 10px;
}

.image-button-container {
    width: 100px;
    height: 100px;
    margin: 10px;
    position: relative;
    border-width: 1px;
    border-radius: 10px;
}

.image-button {
    position: relative;
    color: inherit;
    background-color: #999;
    transition: background-color .3s ease-in-out;
    width: 100px;
    height: 100px;
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
    font-size: 1rem;
    color: #fff;
}

.image-button:hover {
    
    background-color: rgb(223, 222, 222);
    
    color: inherit;
    cursor: pointer;
    
}

.active {
    background-color: #5ab3c4;
}

@media only screen and (min-width: 960px) {
    /* .image-button, .image-button-container {
        width: 300px;
        height: 300px;
    }

    .image-button-container {
        margin: 10px;
    } */
}
</style>
