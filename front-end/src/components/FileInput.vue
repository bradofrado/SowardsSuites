<template>
    <div class="imageInput" @click="chooseImage">
        <img v-if="theUrl" :src="theUrl" />
        <div v-if="!theUrl" class="placeholder">
            {{title}}
        </div>
        <input class="fileInput" ref="fileInput" type="file" @input="fileChanged">
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        url: String
    },
    data() {
        return {
            theUrl: ""
        }
    },
    created () {
        this.theUrl = this.$props.url;
    },
    methods: {
        fileChanged(event) {
            const file = event.target.files[0];
            this.theUrl = URL.createObjectURL(file);

            this.$emit('onUpload', file);
        },
        chooseImage() {
            this.$refs.fileInput.click()
        },
    }
}
</script>

<style scoped>

.placeholder {
    background: #f0f0f0;
    width: 200px;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    font-size: 14px;
    cursor: pointer;
}

.fileInput {
  display: none;
}

.imageInput {
    margin: 10px;
}

.imageInput .placeholder:hover {
    background-color: #999;
}

.imageInput img, .imageInput .placeholder {
    cursor: pointer;
}

img {
  width: 200px;
}
</style>