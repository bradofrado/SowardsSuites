<template>
<div class="events-view-container">
    <h1>Events</h1>
    <div class="events-container">
        <event v-for="(event, i) in events" :event="event" :key="i"/>
    </div>
</div>
</template>

<script>
import axios from 'axios';

import Event from '../components/Event.vue';
export default {
    name: "EventsView",
    components: {
        Event
    },
    data() {
        return {
            events: []
        }
    },
    async created() {
        await this.getEvents();
        this.$root.$data.isLoading = false;
    },
    methods: {
        async getEvents() {
            try {
                const response = await axios.get('/api/events');

                this.events = response.data;
            } catch(err) {
                console.log(err);
            }
        },
    }
}
</script>

<style scoped>
.events-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    grid-auto-rows: minmax(100px, auto);
}

.events-view-container {

}
</style>