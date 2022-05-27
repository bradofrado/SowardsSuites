<template>
    <div class="event-container">
        <h1>{{event.title}}</h1>
        <img :src="event.image"/>
        <div class="d-flex justify-content-center no_hover">
            <date-range-button :start="event.startDate" :end="event.endDate"/>
        </div>
        <p class="event-description">{{event.description}}</p>
    </div>
</template>

<script>
import DateRangeButton from './DateRangeButton.vue'
export default {
    components: { DateRangeButton },
    name: "Event",
    props: {
        event: Object
    }
}
</script>

<style scoped>
.event-container {
    border-width: 3px;
    height: 100%;
}

img {
    max-width: 300px;
    max-height: 300px;
    width: 100%;
}

.event-description {
    padding: 20px;
}
</style>