<template v-slot:items >
<li class="context-item" @click="onClick">
    <slot></slot>
</li>
</template>

<script>
export default {
    name: "ContextMenuItems",
    props: {
        show: Boolean
    },
    methods: {
        onClick() {
            this.$emit('click');
            this.$parent.close();
        }
    }
}
</script>

<style scoped>
.context-item:hover {
    background-color: #999;
}

.context-item {
    margin: 5px 0px;
}
</style>