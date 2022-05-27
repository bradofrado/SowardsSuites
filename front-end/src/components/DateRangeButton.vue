<template>
    <button :class="'button-secondary rounded d-inline-flex justify-content-center' + (this.$listeners && this.$listeners.click ? '' : ' no-hover')" v-b-tooltip.hover @click="$emit('click')"  :title="title" >
        <span class="calendar-list-date-value">{{dateFormat(start)}}</span>
        <icon name="arrowRight"/>
        <span class="calendar-list-date-value">{{dateFormat(end)}}</span>
        <icon :name="icon"/>
    </button>
</template>

<script>
import dateFormat from '@/dateFormat.js';
import Icon from './Icon.vue';

export default {
    name: "DateRangeButton",
    props: {
        start: String,
        end: String,
        title: String,
        icon: String
    },
    components: {
        Icon
    },
    computed: {
        _class() {
            return 'button-secondary rounded d-inline-flex justify-content-center' + (this.$listeners && this.$listeners.click ? '' : ' no_hover');
        }
    },
    methods: {
        dateFormat,
    }
}
</script>

<style scoped>
.calendar-list-date-value {
    height: 28px;
    padding: 3px 5px;
}
</style>