<template>
<div>
    <h1 id="booking-top">Book a Room</h1>
    <div class="book-container">
        <div>
            <v-date-picker class="center" :attributes='attrs' v-model="range" is-range :min-date="new Date()" 
                :columns="$screens({ default: 1, lg: 2 })" @dayclick="onDayClick" ref="calendar"/>
            <p v-if="edit" class="text-center">Editing booking for <button v-b-tooltip.hover title="cancel"  @click="onCancelEdit" class="button-secondary rounded d-inline-flex justify-content-center">
                    <span class="booking-list-date-value">{{dateFormat(edit.date.start)}}</span>
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
                    <span class="booking-list-date-value">{{dateFormat(edit.date.end)}}</span>
                    <svg
                        class="m-2 arrow-svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button></p>
            <div class="d-flex justify-content-center mt-3">
                <span class="date-label">{{dateFormat(this.range && this.range.start)}}</span>
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
                <span class="date-label">{{dateFormat(this.range && this.range.end)}}</span>
            </div>
            <div v-b-tooltip.hover :title="bookBtnTooltip">
                <div class="center w-50 d-flex">
                <button :class="'button-primary h-2 mw-125 ' + bookBtnClass" @click="onBook" :disabled="bookBtnDisabled">
                    <span v-if="!loading">Book</span>
                    <div v-else class="loader l-small"></div>
                </button>
                <button v-if="edit" class="button-secondary w-48 h-2 ml-0" @click="onDelete(edit)">
                    <span v-if="!loadingDelete">Delete</span>
                    <div v-else class="loader l-small"></div>
                </button>
                </div>
            </div>
        </div>
        <div class="rooms-container">
            <div v-for="room in rooms" :key="room.activeId">
                <ImageCheckbox :id='room._id' :name="room.name" :active='room.active' :img="room.thumbnail" @click="onImageCheckboxClick"/>
            </div>
        </div>
    </div>
    <div v-if="user && myBookings.length">
        <h1>My Bookings</h1>
        <div class="booking-list-container" v-for="booking in myBookings" :key="booking.date.start.toDateString()">
            <div class="booking-list-dates">
                <button v-b-tooltip.hover title="edit" @click="onEdit(booking)" class="button-secondary rounded d-flex justify-content-center">
                    <span class="booking-list-date-value">{{dateFormat(booking.date.start)}}</span>
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
                    <span class="booking-list-date-value">{{dateFormat(booking.date.end)}}</span>
                </button>
            </div>
            <div class="booking-list-rooms">
                <ImageButton v-for="room in booking.rooms" :key="room._id" class="booking-list-room" :img="room.thumbnail" :name="room.name"/>
            </div>
        </div>
    </div>
</div>
</template>

<script>
//import VCalendar from 'v-calendar';
import axios from 'axios';
import dayjs from 'dayjs';
import ImageCheckbox from '@/components/ImageCheckbox.vue'
import ImageButton from '@/components/ImageButton.vue'

export default {
    name: "BookView",
    components: {
        ImageCheckbox,
        ImageButton
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
            calendar: null,
            loading: false,
            loadingDelete: false,
            edit: null
        }
    },
    async mounted() {
        await this.getRooms();
        await this.getBookings();
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
        selectedRooms() {
            return this.rooms.filter(room => room.active);
        },
        myBookings() {
            const bookings = this.days.filter(day => day.person && day.person.username === this.user.username);
            
            return bookings
        },
        bookBtnClass() {
            let btnClass = '';
            btnClass += this.bookBtnDisabled ? 'disabled ' : '';
            btnClass += this.edit ? ' w-48 mr-1' : ' w-100 center ';
            return btnClass;
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
    watch: {
        edit(edit) {
            if (edit) {
                this.range = edit.date;
                this.rooms = this.rooms.map(room => {
                    room.active = false;
                    if (edit.rooms.find(x => x._id === room._id)) {
                        room.active = true;
                    }

                    return room;
                });
                this.$refs.calendar.focusDate(edit.date.start); 
                this.$refs.calendar.dragValue = null;
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
                this.days = response.data.map(booking => {
                    if (!this.currUsers[booking.user.firstname]) {
                        this.currUsers[booking.user.firstname] = this.color;
                        this.color = this.next(this.color, this.colors);
                    }

                    return {
                        _id: booking._id,
                        date: {
                            //The back-end is in utc time, so use that
                            start: dayjs.utc(booking.startDate).toDate(),
                            end: dayjs.utc(booking.endDate).toDate()
                        },
                        person: booking.user,
                        rooms: booking.rooms,
                        color: this.currUsers[booking.user.firstname]
                    }
                });
                
                //Have something shown on today
                this.days.push({date: new Date()});
            } catch(error) {
                //console.log(error);
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
                this.loading = true;

                //Make the time the end of day of the local time, then convert that to utc (back-end is in utc time)
                const start = dayjs.utc(this.range.start.setHours(23, 59, 59, 999));
                const end = dayjs(this.range.end.setHours(23, 59, 59, 999));
                if (this.edit) {
                    await axios.put('/api/bookings/' + this.edit._id, {
                        start: start,
                        end: end,
                        rooms: this.selectedRooms.map(x => x._id)
                    });
                }
                else {
                    await axios.post('/api/bookings', {
                        start: start,
                        end: end,
                        rooms: this.selectedRooms.map(x => x._id)
                    });
                }
                await this.getRooms();
                await this.getBookings();
                this.range = null;
                this.edit = null;
                this.loading = false;
            } catch(error) {
                //console.log(error);
                
                if (error.response.data.message) {
                    alert(error.response.data.message);
                }

                this.loading = false;
            }
        },
        onDayClick(e) {
            if (this.$refs.calendar.isDragging) {
                this.range = null;
            }

            if (this.edit || !this.$refs.calendar.isDragging) {
                return;
            }

            const date = e.date.setHours(23, 59, 59, 999);

            const bookings = this.myBookings.filter(booking => {
                if (date >= booking.date.start && date <= booking.date.end) {
                    return true;
                }

                return false;
            });

            if (bookings.length) {
                this.edit = bookings[0];
            }
            
        },
        onCancelEdit() {
            if (!this.edit) return;

            this.edit = null;
            this.range = null;
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
        async onDelete(booking) {
            try {
                this.loadingDelete = true;
                await axios.delete('/api/bookings/'+booking._id);

                await this.getRooms();
                await this.getBookings();
                this.range = null;
                this.edit = null;
                this.loadingDelete = false;
            } catch(error) {
                //console.log(error);
                this.loadingDelete = false;
            }
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
                    label: `${day.person.firstname}-${rooms}`
                }
            };
        },
        next(curr, all) {
            const index = all.findIndex(x => x === curr);

            curr = index + 1 < all.length ? all[index+1] : all[0];

            return curr
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
    display: flex;
    flex-direction: column;
    justify-content: center;
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

   .booking-list-room {
        margin: 0 20px 20px 0;
        width: 100px;
        height: 100px;
        font-size: 7px;
    }
}
</style>