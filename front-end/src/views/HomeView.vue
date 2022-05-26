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
            <ImageButton to="/about" name="Upcoming Events"/>
        </div>
    </div>
    <event-calendar />
  </div>
</template>

<script>
import ImageButton from '@/components/ImageButton.vue'
import EventCalendar from '../components/EventCalendar.vue';


export default {
    name: 'HomeView',
    components: {
        ImageButton,
        EventCalendar
    },
    async created() {
        this.$root.$data.isLoading = false;
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

@media only screen and (min-width: 960px) {
    .home-buttons {
            flex-direction: row;
    }
}
</style>
