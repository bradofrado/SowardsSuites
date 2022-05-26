<template>
<div v-if="show">
    <slot></slot>
</div>
</template>

<script>
// import Vue from 'vue'
// import Uploader from '@/components/Uploader.vue'

export default {
    name: 'Modal',
    props: {
        show: Boolean,
    },
    data() {
        return {
            modal: null
        }
    },
    watch: {
        show(show) {
            if (show) {
                // const ComponentClass = Vue.extend(Uploader);
                // const instance = new ComponentClass();
                // instance.$mount();
                // this.$root.$refs.app.$refs.modal(instance.$el);
                this.$root.$refs.app.$refs.modal.showModal(this.$slots.default);
            }
            else {
                this.$root.$refs.app.$refs.modal.hideModal();
            }
        }
    }
}
</script>

<style scoped>
/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  transition: opacity 0.5s ease;
  display: flex;
  transition: background 0.2s ease-in-out, height 1s ease-in-out;
  transition: height 0.2s ease-in-out, width 0.2s ease-in-out;
  justify-content: center;
  transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
}

.modal-container {
  width: 50%;
  height: max-content;
  margin-top: 40px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 0.5s ease;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* Form */
</style>
