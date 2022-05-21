<template>
    <button v-b-toggle="id" class="button button-secondary toggle" @click="e => $emit('click', e)">
        <icon class="when-closed" name="plus"/>
        <icon class="when-open light" name="cancel-fill"/>
        <span class="button-text"><slot/></span>
    </button>
</template>

<script>
import Icon from '@/components/Icon.vue';

export default {
    name: "FilterButton",
    props: {
        id: String
    },
    components: {
        Icon
    },
    // created() {
    //     console.log(this);
    // },
    // computed: {
    //     tag() {
    //         return this._uid.toString();
    //     }
    // }
}
</script>

<style scoped>
.toggle {
    border-radius: 20px;
    min-height: 24px;
    height: 24px;
    display: inline-flex;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

.collapsed {
    border-style: dashed;
}

.not-collapsed {
    border-style: solid;
    background-color: #0f8aa0;
    color: #fff;
}
</style>