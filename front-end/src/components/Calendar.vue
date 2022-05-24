<template>
<div>
    <v-date-picker class="center" :attributes='attrs' v-model="range" is-range :min-date="new Date()" 
        :columns="$screens({ default: 1, lg: screens })" @dayclick="onDayClick" ref="calendar">
        <template #day-popover="{ dayTitle, attributes, hide }">
            <div>
                <div class="text-xs text-gray-300 font-semibold text-center">
                    {{ dayTitle }}
                </div>
                <popover-row
                    v-for="attr in attributes"
                    :key="attr.key"
                    :attribute="attr">
                    <slot name="label" :label="attr.customData.label" :booking="attr.customData.booking" :hide="hide"> 
                         <span>{{attr.customData.label}}</span>
                    </slot>                   
                </popover-row>
            </div>
        </template>
    </v-date-picker>
    <p v-if="edit" class="text-center">Editing booking for <date-range-button @click="onCancelEdit" title="cancel" :start="edit.startDate" :end="edit.endDate" icon="cancel"/></p>
    <div class="d-flex justify-content-center mt-3">
        <span class="date-label">{{dateFormat(this.range && this.range.start)}}</span>
        <icon name="arrowRight"/>        
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
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import DateRangeButton from '@/components/DateRangeButton.vue';
import Icon from '@/components/Icon.vue';
import dateFormat from '@/dateFormat.js';
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'

export default {
    name: "Calendar",
    props: {
        bookings: Array,
        rooms: Array,
        edit: Object,
        screens: {
            default: 1,
            type: Number
        }
    },
    components: {
        DateRangeButton,
        Icon,
        PopoverRow,
    },
    data() {
        return {
            days: [],            
            currUsers: {},
            range: null,
            color: 'blue',
            colors: ['blue', 'red', 'orange', 'yellow', 'green', 'teal', 'indigo', 'purple', 'pink', 'gray'],
            calendar: null,
            loading: false,
            loadingDelete: false
        }
    },
    created() {
        this.days = this.bookings.map(booking => this.transformBooking(booking));

        //Have something shown on today
        this.days.push({date: new Date()});
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
        bookBtnClass() {
            let btnClass = '';
            btnClass += this.bookBtnDisabled ? 'disabled ' : '';
            btnClass += this.edit ? ' w-48 mr-1' : ' w-100 center ';
            return btnClass;
        },
        bookBtnDisabled() {
            return !this.range || this.rooms.length === 0;
        },
        bookBtnTooltip() {
            if (this.bookBtnDisabled) {
                if (!this.range) {
                    return 'Select a range of dates';
                }

                if (this.rooms.length === 0) {
                    return 'Select a room';
                }
            }

            return '';
        }
    },
    watch: {
        edit(edit) {
            if (edit) {
                this.range = null;

                this.$nextTick(() => {
                    const editDay = this.transformBooking(edit);
                    this.$refs.calendar.focusDate(editDay.date.start); 
                    this.$refs.calendar.dragValue = null;
                    this.range = editDay.date; 
                });
                               
            } 
        },
        bookings(bookings) {
            this.days = bookings.map(booking => this.transformBooking(booking));

            //Have something shown on today
            this.days.push({date: new Date()});
        }
    },
    methods: {            
        transformBooking(booking) {
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
        },
        async onBook() {
            if (!this.user) {
                alert("You must be logged in to book a room");
                return;
            }

            if (!this.range) {
                return;
            }

            if (this.rooms.length === 0) {
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
                        rooms: this.rooms.map(x => x._id)
                    });
                }
                else {
                    await axios.post('/api/bookings', {
                        start: start,
                        end: end,
                        rooms: this.rooms.map(x => x._id)
                    });
                }
                this.$emit('onBook', start, end, this.rooms);
                this.range = null;
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

            this.$emit('onDayClick', e);            
        },
        async onDelete(booking) {
            try {
                this.loadingDelete = true;
                await axios.delete('/api/bookings/'+booking._id);
                
                this.range = null;
                this.loadingDelete = false;

                this.$emit('onDelete', booking);
            } catch(error) {
                this.loadingDelete = false;
            }
        },
        onCancelEdit() {
            this.range = null;
            this.$emit('onCancelEdit');
        },
        getFormat(day) {
            if (!day.person) {
                return {
                    dates: day.date,
                    highlight: true
                }
            }

            const rooms = day.rooms.reduce((prev, curr, i) => {
                prev += curr.name;

                if (i < day.rooms.length - 1) {
                    prev += ', ';
                }
                
                return prev;
            }, '');

            const booking = this.bookings.find(x => x._id === day._id);

            if (!booking) {
                throw Error("Cannot find booking");
            }

            return {
                dates: day.date,
                bar: day.color,
                popover: {
                    //isInteractive: true,
                    visibility: 'hover',                    
                },
                customData: {
                    label: `${day.person.firstname}-${rooms}`,
                    booking: booking
                }                
            };
        },
        next(curr, all) {
            const index = all.findIndex(x => x === curr);

            curr = index + 1 < all.length ? all[index+1] : all[0];

            return curr
        },
        dateFormat
    }
}
</script>

<style scoped>

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

.calendar-list-date-value {
    height: 28px;
    padding: 3px 5px;
}

</style>