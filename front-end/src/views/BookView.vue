<template>
<div>
    <h1>Book a Room</h1>
    <div class="book-container">
        <div>
            <v-date-picker class="center" :attributes='attrs' v-model="range" is-range :min-date="new Date()" 
                :columns="$screens({ default: 1, lg: 2 })" @dayclick="onDayClick" ref="calendar"/>
            <div class="d-flex justify-content-center mt-3">
                <span class="date-label">{{rangeStart}}</span>
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
                <span class="date-label">{{rangeEnd}}</span>
            </div>
            <div v-b-tooltip.hover :title="bookBtnTooltip"><button  :class="'button-primary w-25 center ' + bookBtnClass" @click="onBook" :disabled="bookBtnDisabled">Book</button></div>
        </div>
        <div class="rooms-container">
            <div v-for="room in rooms" :key="room.activeId">
                <ImageCheckbox :id='room._id' :name="room.name" :active='room.active' :img="room.thumbnail" @click="onImageCheckboxClick"/>
            </div>
        </div>
    </div>
</div>
</template>

<script>
//import VCalendar from 'v-calendar';
import axios from 'axios';
import moment from 'moment';
import ImageCheckbox from '@/components/ImageCheckbox.vue'

export default {
    name: "BookView",
    components: {
        ImageCheckbox,
    },
    data() {
        return {
            days: [{
                date: new Date(),
            }],
            currUsers: {},
            rooms: [],
            room: null,
            range: null,
            color: 'blue',
            person: 'Braydon',
            colors: ['blue', 'red', 'orange', 'yellow', 'green', 'teal', 'indigo', 'purple', 'pink', 'gray'],
            calendar: null
        }
    },
    mounted() {
        this.getRooms();
        this.getBookings();
        this.$root.$data.isLoading = false;
    },
    computed: {
        attrs() {
            const days = this.days.map((day,i) => {
                return this.getFormat(day, i);
            });
            return days;
        },
        user() {
            return this.$root.$data.user;
        },
        rangeStart() {
            return this.range && this.range.start ? moment(this.range.start).format('MM/DD/YYYY') : '';
        },
        rangeEnd() {
            return this.range && this.range.end ? moment(this.range.end).format('MM/DD/YYYY') : '';
        },
        selectedRooms() {
            return this.rooms.filter(room => room.active);
        },
        bookBtnClass() {
            return this.bookBtnDisabled ? 'disabled' : '';
        },
        bookBtnDisabled() {
            return !this.range || this.selectedRooms.length === 0;
        },
        bookBtnTooltip() {
            if (this.bookBtnDisabled) {
                if (!this.range) {
                    return 'Select a range of dates';
                }

                if (this.selectedRooms.length === 0) {
                    return 'Select a room';
                }
            }

            return '';
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
                console.log(error);
                this.$root.$data.isLoading = false;
                return false;
            }
        }, 
        async getBookings() {
            try {
                let response = await axios.get('/api/bookings');
                this.days = response.data.map(booking => {
                    if (!this.currUsers[booking.user.firstname]) {
                        this.currUsers[booking.user.firstname] = this.color;
                        this.color = this.next(this.color, this.colors);
                    }

                    return {
                        date: {
                            start: moment(booking.startDate).toDate(),
                            end: moment(booking.endDate).toDate()
                        },
                        person: booking.user.firstname,
                        rooms: booking.rooms,
                        color: this.currUsers[booking.user.firstname]
                    }
                });
                console.log(response.data);
                console.log(this.days);

                //Have something shown on today
                this.days.push({date: new Date()});
            } catch(error) {
                console.log(error);
            }
            
        },
        async onBook() {
            if (!this.user) {
                alert("You must be logged in to book a room");
                return;
            }

            if (!this.range) {
                return;
            }

            if (this.selectedRooms.length === 0) {
                return;
            }

            try {
                await axios.post('/api/bookings', {
                    start: this.range.start,
                    end: this.range.end,
                    rooms: this.selectedRooms.map(x => x._id)
                });
                this.range = null;
                this.getBookings();
                this.getRooms();
            } catch(error) {
                console.log(error);
            }
            
            console.log(this.days);
        },
        onDayClick() {
            if (this.$refs.calendar.isDragging) {
                this.range = null;
            }
            
        },
        onImageCheckboxClick(id) {
            const room = this.rooms.find(x => x._id === id);
            room.active = !room.active;
            room.activeId = room._id + room.active;
        },
        getFormat(day) {
            if (!day.person) {
                return {
                    dates: day.date,
                    highlight: true
                }
            }

            //const color = index + 1 < this.colors.length ? this.colors[index+1] : this.colors[0];
            const rooms = day.rooms.reduce((prev, curr, i) => {
                prev += curr.name;

                if (i < day.rooms.length - 1) {
                    prev += ', ';
                }
                
                return prev;
            }, '');

            return {
                dates: day.date,
                bar: day.color,
                popover: {
                    label: `${day.person}-${rooms}`
                }
            };
        },
        next(curr, all) {
            const index = all.findIndex(x => x === curr);

            curr = index + 1 < all.length ? all[index+1] : all[0];

            return curr
        }
    }
}
</script>

<style scoped>
.book-container {
    display: flex;
    margin-top: 20px;
}

.rooms-container {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;
}

.center {
    display: block;
    margin: 10px auto;
}

.arrow-svg {
    stroke: currentColor;
    height: 1rem;
    width: 1rem;
}

.date-label {
    min-width: 80px;
    height: 28px;
    padding: 3px 5px;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background-color: #f7fafc;
}

svg {
    display: block;
}
</style>