<template>
    <div class="booking-list-container">
        <div class="booking-list-dates">
            <date-range-button :class="no_hover" @click="onClick" :title="title" :start="booking.startDate" :end="booking.endDate"/>                
        </div>
        <div class="booking-list-rooms">
            <image-button v-for="room in booking.rooms" :key="room._id" class="booking-list-room" :img="room.thumbnail" />
        </div>
    </div>
</template>

<script>
import DateRangeButton from './DateRangeButton.vue'
import ImageButton from './ImageButton.vue'
export default {
    name: "BookingDetail",
    props: {
        edit: Boolean,
        booking: Object
    },
    components: {
        DateRangeButton,
        ImageButton,
    },
    computed: {
        title() {
            return this.edit ? 'edit' : '';
        },
        no_hover() {
            return this.edit ? '' : 'no-hover'
        }
    },
    methods: {
        onClick() {
            if (this.edit) {
                this.$emit('edit', this.booking);
            }
        }
    }
}
</script>

<style scoped>
.booking-list-container {
    display: flex;
    margin-top: 40px;
    flex-direction: column;
}

.booking-list-dates {
    margin: auto;
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

.no-hover:hover {
    background-color: #f7fafc;
    cursor: default;
}

@media only screen and (min-width: 960px) {
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