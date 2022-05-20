<template>
    <button v-b-tooltip.hover @click="$emit('click')"  :title="title" class="button-secondary rounded d-inline-flex justify-content-center">
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