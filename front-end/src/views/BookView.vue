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
    <filter-button v-if="bookings.length" id="allBookings">All Bookings</filter-button>
    <filter-button class="ml-0" v-if="user && myBookings.length" id="myBookings">My Bookings</filter-button>
    <b-collapse id="allBookings">
        <h1>All Bookings</h1>
        <booking-detail v-for="booking in bookings" :booking="booking" :key="booking.startDate" :edit="isAdmin || (user && booking.user.username === user.username)" @edit="onEdit"/>
    </b-collapse>
    <b-collapse id="myBookings">
        <h1>My Bookings</h1>
        <booking-detail v-for="booking in myBookings" :booking="booking" edit @edit="onEdit" :key="booking.startDate"/>
    </b-collapse>
</div>
</template>

<script>
//import VCalendar from 'v-calendar';
import axios from 'axios';
import dayjs from 'dayjs';
import ImageCheckbox from '@/components/ImageCheckbox.vue'
import Calendar from '@/components/Calendar.vue';
import FilterButton from '../components/FilterButton.vue';
import BookingDetail from '../components/BookingDetail.vue';

export default {
    name: "BookView",
    components: {
        ImageCheckbox,
        Calendar,
        FilterButton,
        BookingDetail,
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
            if (!this.user) {
                return null;
            }

            const bookings = this.bookings.filter(booking => booking.user.username === this.user.username);
            
            return bookings
        },
        user() {
            return this.$root.$data.user;
        },
        isAdmin() {
            return this.user && this.user.roles.includes("Admin");
        }
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
}
</style>