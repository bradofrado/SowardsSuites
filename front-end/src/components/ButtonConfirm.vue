<template>
<button @click="onClick">
    <slot></slot>
    <Modal :show="show">
        <p>{{message}}</p>
        <div class="buttons-container">
            <button class="button button-secondary footer-button" @click="onCancel">{{cancelText}}</button>
            <button class="button button-primary footer-button" @click="onConfirm">{{confirmText}}</button>
        </div>
    </Modal>
</button>
</template>

<script>
import Modal from '@/components/Modal.vue'


export default {
    components: { Modal },
    inheritAttrs: false,
    name: "ButtonConfirm",
    props: {
        message: String,
        confirmText: {
            type: String,
            default: 'Confirm'
        },
        cancelText: {
            type: String,
            default: 'Cancel'
        }
    },
    data() {
        return {
            show: false,
            e: null
        }
    },
    created() {
        console.log(this.$attrs);
    },
    methods: {
        onClick(e) {
            this.show = true;
            this.e = e;            
        },
        onConfirm() {
            this.show = false;
            this.$emit('confirm', this.e);
        },
        onCancel() {
            console.log('You clicked me');
            this.show = false;
            this.$emit('cancel', this.e);
        }
    }
}
</script>

<style scoped>
.buttons-container {
    display: flex;
    justify-content: right;
    margin-top: 20px;
}

.footer-button {
    margin-left: 20px;
}
</style>