<template>
<div>
    <calendar @dayclick="onDayClick" v-model="range" :days="days" :edit="editDate" :screens="screens">
        <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
            <slot :name="name" v-bind="data"></slot>
        </template>
    </calendar>
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
import Calendar from './Calendar.vue';

export default {
    name: "BookCalendar",
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
        Calendar
    },
    
    data() {
        return {
            days: [],            
            currUsers: {},
            range: null,
            editDate: null,
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
                this.editDate = {
                    start: dayjs.utc(edit.startDate).toDate(),
                    end: dayjs.utc(edit.endDate).toDate()
                }
                               
            }
            else {
                this.editDate = null;
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
            const rooms = booking.rooms.reduce((prev, curr, i) => {
                prev += curr.name;

                if (i < booking.rooms.length - 1) {
                    prev += ', ';
                }
                
                return prev;
            }, '');

            return {
                _id: booking._id,
                date: {
                    //The back-end is in utc time, so use that
                    start: dayjs.utc(booking.startDate).toDate(),
                    end: dayjs.utc(booking.endDate).toDate()
                },
                user: booking.user,
                color: null,
                label: `${booking.user.firstname}-${rooms}`,
                data: booking
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

                const start = this.range.start;
                const end = this.range.end;
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
            // if (this.$refs.calendar.isDragging) {
            //     this.range = null;
            // }

            // if (this.edit || !this.$refs.calendar.isDragging) {
            //     return;
            // }

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