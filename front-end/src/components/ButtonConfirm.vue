<template>
<div>
    <button v-bind="$attrs" @click="onClick"><slot></slot></button>
    <Modal :show="show">
        <h4>{{message}}</h4>
        <button class="button button-secondary" @click="onCancel">{{cancelText}}</button>
        <button class="button button-primary" @click="onConfirm">{{confirmText}}</button>
    </Modal>
</div>
</template>

<script>
import Modal from '@/components/Modal.vue'


export default {
  components: { Modal },
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