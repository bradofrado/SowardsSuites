<template>
<div>
    <h1 id="booking-top">Book a Room</h1>
    <div class="book-container">
        <calendar :rooms="selectedRooms" :bookings="bookings" :edit="edit" :screens="2"
            @onCancelEdit="onCancelEdit" @onBook="onBook" @onDelete="onDelete" @onDayClick="onDayClick"/>
        <div class="rooms-container">
            <div v-for="room in rooms" :key="room.activeId">
                <ImageCheckbox :id='room._id' :active='room.active' :img="room.thumbnail" @click="onImageCheckboxClick" :title="room.name"/>
            </div>
        </div>
    </div>
    <filter-button id="allBookings">All Bookings</filter-button>
    <filter-button class="ml-0" v-if="user && myBookings.length" id="myBookings">My Bookings</filter-button>
    <b-collapse id="allBookings">
        <h1>All Bookings</h1>
        <div class="booking-list-container" v-for="booking in bookings" :key="booking.startDate">
            <div class="booking-list-dates">
                <date-range-button :start="booking.startDate" :end="booking.endDate"/>                
            </div>
            <div class="booking-list-rooms">
                <ImageButton v-for="room in booking.rooms" :key="room._id" class="booking-list-room" :img="room.thumbnail" />
            </div>
        </div> 
    </b-collapse>
    <b-collapse id="myBookings">
        <h1>My Bookings</h1>
        <div class="booking-list-container" v-for="booking in myBookings" :key="booking.startDate">
            <div class="booking-list-dates">
                <date-range-button @click="onEdit(booking)" title="edit" :start="booking.startDate" :end="booking.endDate"/>                
            </div>
            <div class="booking-list-rooms">
                <ImageButton v-for="room in booking.rooms" :key="room._id" class="booking-list-room" :img="room.thumbnail" />
            </div>
        </div> 
    </b-collapse>
</div>
</template>

<script>
//import VCalendar from 'v-calendar';
import axios from 'axios';
import dayjs from 'dayjs';
import ImageCheckbox from '@/components/ImageCheckbox.vue'
import ImageButton from '@/components/ImageButton.vue'
import Calendar from '@/components/Calendar.vue';
import DateRangeButton from '@/components/DateRangeButton.vue';
//import Icon from '../components/Icon.vue';
import FilterButton from '../components/FilterButton.vue';

export default {
    name: "BookView",
    components: {
        ImageCheckbox,
        ImageButton,
        Calendar,
        DateRangeButton,
        //Icon,
        FilterButton
    },
    data() {
        return {            
            bookings: [],
            rooms: [],
            edit: null
        }
    },
    async mounted() {
        await this.getRooms();
        await this.getBookings();
        this.$root.$data.isLoading = false;
    },
    computed: {        
        selectedRooms() {
            return this.rooms.filter(room => room.active);
        },
        myBookings() {
            const bookings = this.bookings.filter(booking => booking.user.username === this.user.username);
            
            return bookings
        },
        user() {
            return this.$root.$data.user;
        },
    },
    watch: {
        edit(edit) {
            if (edit) {
                this.rooms = this.rooms.map(room => {
                    room.active = false;
                    if (edit.rooms.find(x => x._id === room._id)) {
                        room.active = true;
                    }

                    return room;
                });                
            } 
        }
    },
    methods: {
        async getRooms() {
            try {
                let response = await axios.get('/api/rooms');
                this.rooms = response.data.map(room => ({...room, active: false, activeId: room._id}));
                this.$root.$data.isLoading = false;

                return true;
            } catch(error) {
                //console.log(error);
                this.$root.$data.isLoading = false;
                return false;
            }
        }, 
        async getBookings() {
            try {
                let response = await axios.get('/api/bookings');
                this.bookings = response.data;
            } catch(error) {
                //console.log(error);
            }
            
        },
        async onBook() {
            await this.getRooms();
            await this.getBookings();
            this.edit = null;  
        },
        onDayClick(e) {
            const date = e.date.setHours(23, 59, 59, 999);

            const bookings = this.myBookings.filter(booking => {
                if (date >= new Date(booking.startDate) && date <= new Date(booking.endDate)) {
                    return true;
                }

                return false;
            });

            if (bookings.length) {
                this.edit = bookings[0];
            }
            
        },
        onCancelEdit() {
            this.edit = null;
            this.rooms = this.rooms.map(room => ({...room, active: false}));
        },
        onImageCheckboxClick(id) {
            const room = this.rooms.find(x => x._id === id);
            room.active = !room.active;
            room.activeId = room._id + room.active;
        },
        onEdit(booking) {
            this.edit = booking;
            window.scrollTo(0,0);
        },
        async onDelete() {
            this.edit = null;
            await this.getRooms();
            await this.getBookings();                
        },
        dateFormat(date) {
            return date ? dayjs(date).format('MM/DD/YYYY') : ''
        }
    }
}
</script>

<style scoped>
.book-container {
    display: flex;
    margin: 20px 0;
    flex-direction: column;
}

.rooms-container {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
}

.booking-list-container {
    display: flex;
    margin-top: 40px;
    flex-direction: column;
}

.booking-list-rooms {
    display: flex;
    margin: 0 20px;
    flex-wrap: wrap;
}

.booking-list-room {
    margin: 20px 5px;
    width: 90px;
    height: 90px;
    font-size: 0.5rem;
}

.booking-list-dates {
    margin: auto;
}

.booking-list-date-value {
    height: 28px;
    padding: 3px 5px;
}



@media only screen and (min-width: 960px) {
   .book-container {
       flex-direction: row;
   }

   .rooms-container {
       padding-left: 20px;
   }

   .booking-list-container {
       flex-direction: row;
   }

   .booking-list-dates {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0;
   }

   .booking-list-room {
        margin: 0 20px 20px 0;
        width: 100px;
        height: 100px;
        font-size: 7px;
    }
}
</style>