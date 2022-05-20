<template>
    <div :class="'image-button-container ' + activeClass">
        <image-button v-bind="$props" @click="$emit('click', id)" class="image-button-inner"/>
    </div>
</template>

<script>
import ImageButton from './ImageButton.vue';
export default {
    name: "ImageCheckbox",
    props: {
        name: String,
        img: String,
        click: Function,
        active: Boolean,
        id: String,
        title: String
    },
    components: {
        ImageButton
    },
    computed: {
        activeClass() {
            return this.$props.active ? 'active' : '';
        }
    }
}
</script>

<style scoped>
img {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
}

.image-button-container {
    width: 90px;
    height: 90px;
    margin: 10px;
    position: relative;
    border-width: 1px;
    border-radius: 10px;
}

.image-button-inner {
    margin: 0px;
    padding: 10px;
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
    .image-button-container {
        width: 100px;
        height: 100px;
    }
}
</style>
