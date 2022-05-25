<template>
    <div class="room-container" v-if="room">
        <div class="room-main-image">
            <div class="room-name-container">
                <h1 name="room-name">{{room.name}}</h1>                
            </div>
            <img :src="room.image"/>            
        </div>
        <div class="room-intro-container">
            <div class="room-name-container-big">
                <h1 name="room-name">{{room.name}}</h1>
            </div>
            <hr/>
            <div class="room-description-container">
                <p name="room-description">{{room.description}}</p>
            </div>
            <book-calendar :rooms="[room]" :bookings="bookings" @onBook="onBook"/>
        </div>
        <div class="room-amenities"></div>
    </div>
</template>

<script>
import axios from 'axios'
import BookCalendar from '@/components/BookCalendar.vue';
export default {
    name: "RoomView",
    components: { 
        BookCalendar 
    },
    data() {
        return {
            room: null,
            bookings: []
        }
    },
    async created() {
        await this.getRoom();
        await this.getBookings();
        this.$root.$data.isLoading = false;
    },
    methods: {
        async getRoom() {
            try {
                const response = await axios.get('/api/rooms/'+this.$route.params.id);
                this.room = response.data;
                return true;
            } catch(error) {
                //console.log(error);
                return false;
            }
        },
        async getBookings() {
            try {
                const response = await axios.get('/api/bookings?rooms[]='+this.room._id);
                this.bookings = response.data;
                return true;
            } catch(error) {
                //console.log(error);
                return false;
            }
        },
        async onBook() {
            await this.getBookings();
        }
    },
}
</script>

<style scoped>

.room-container {
    display: flex;
    flex-direction: column;
}

.room-main-image, .room-intro-container {
    padding: 0 15px;
}

.room-name-container {
    padding-bottom: 15px;
}

.room-name-container-big {
    display: none;
}

.room-intro-container{
    display: flex;
    flex-direction: column;
    margin-top: 15px;
}

.room-intro-container {
    margin-top: 15px;
}

.room-intro-container-phone {
    margin-bottom: 15px;
}

.room-description-container {
    min-height: 100px; 
    padding-top: 10px;
}

img {
    width: 100%;
    border-radius: 5px;
}

@media only screen and (min-width: 960px) {
    .room-container {
        flex-direction: row;
        padding-top: 20px;
    }

    .room-name-container-big {
        display: block;
    }

    .room-name-container {
        display: none;
    }

    .room-main-image {
        width: 66.66666%;
        padding-right: 15px;
    }

    .room-intro-container {
        display: flex;
        flex-direction: column;
        padding-left: 15px;
        width: 33.333333%;
    }
}
</style>