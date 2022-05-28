<template>
  <div class="home">
    <div>
        <div class="welcome-text">
            <h1>Welcome to Sowards' Suites</h1>
            <h4>What can we help you with?</h4>
        </div>
        <div class="home-buttons">
            <ImageButton to="/rooms" name="Rooms" img="/images/room2.jpg"/>
            <ImageButton to="/book" name="Book" img="/images/Calendar.png" dark/>
            <ImageButton to="/events" name="Events"/>
        </div>
    </div>
    <div class="events-outer">
        <h1>Events</h1>
        <div class="events-container">
            <event-calendar :events="events" @new="getEvents" @delete="getEvents"/>
            <div class="upcoming-event">
                <h4>Upcoming Event</h4>
                <event :event="featuredEvent"/>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import ImageButton from '@/components/ImageButton.vue'
import EventCalendar from '../components/EventCalendar.vue';
import Event from '../components/Event.vue';
import axios from 'axios';

export default {
    name: 'HomeView',
    components: {
        ImageButton,
        EventCalendar,
        Event
    },
    data() {
        return {
            events: []
        }
    },
    async created() {
        this.$root.$data.isLoading = false;
        await this.getEvents();
    },
    computed: {
        featuredEvent() {
            return this.events.length ? this.events[0] : {};
        }
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
        async onSubmitEvent() {
            await this.getEvents();
        }
    }
}
</script>

<style scoped>
.welcome-text h1, h2, h3, h4, h5, h6 {
    margin: 20px;
}

.home-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.home > div {
    margin: 30px 0;
}

.events-container {
    display: flex;
    justify-content:space-around;
    margin-top: 20px;
    flex-direction: column;
}

.events-container > div {
    margin: 10px 20px;
}

h4 {
    margin-top: 0;
}

.events-outer {
    padding-top: 20px;
}

.upcoming-event {
    display: flex;
    flex-direction: column;
}

@media only screen and (min-width: 960px) {
    .home-buttons {
            flex-direction: row;
    }

    .events-container {
        flex-direction: row;
    }
}
</style>
