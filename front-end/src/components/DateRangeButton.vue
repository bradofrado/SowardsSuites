<template>
    <button v-b-tooltip.hover @click="$emit('click')"  :title="title" class="button-secondary rounded d-inline-flex justify-content-center">
        <span class="calendar-list-date-value">{{dateFormat(start)}}</span>
        <span class="flex-shrink-0 m-2">
            <svg
                class="arrow-svg"
                viewBox="0 0 24 24"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
            </svg>
            </span>
        <span class="calendar-list-date-value">{{dateFormat(end)}}</span>
        <svg v-if="icon=='cancel'"
            class="m-2 arrow-svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            >
            <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </button>
</template>

<script>
import dateFormat from '@/dateFormat.js';

export default {
    name: "DateRangeButton",
    props: {
        start: String,
        end: String,
        title: String,
        icon: String
    },
    methods: {
        dateFormat,
    }
}
</script>

<style scoped>
.arrow-svg {
    stroke: currentColor;
    height: 1rem;
    width: 1rem;
}

svg {
    display: block;
}

.calendar-list-date-value {
    height: 28px;
    padding: 3px 5px;
}
</style>