<template>
<div >
    <calendar :days="events" :screens="2" v-model="range"/>
    <div class="center w-125 d-flex justify-content-center" v-b-tooltip.hover :title="eventBtnTooltip">
        <button :class="'button button-primary h-2 mw-125 w-100 ' + (range ? '' : 'disabled')" @click="onNew">New Event</button>
    </div>
    <modal :show="show">
        <uploader :inputs="inputs" @submit="onUpload" :title="title" @close="show = false" :error="error"/>
    </modal>
</div>
</template>

<script>
import Calendar from '../components/Calendar.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import Modal from './Modal.vue';
import Uploader from './Uploader.vue';
import { rangeFormat } from '@/dateFormat.js';

export default {
    name: "EventCalendar",
    data() {
        return {
            events: [],
            show: false,
            range: null,
            error: ''
        }
    },
    components: {
        Calendar,
        Modal,
        Uploader,
    },
    async created() {
        await this.getEvents();
        this.$root.$data.isLoading = false;
    },
    watch: {
        show(show) {
            if (!show) {
                this.range = null;
            }
        }
    },
    computed: {
        inputs() {
            return {
                title: {
                    type: 'input',
                    title: 'Title',
                    required: true
                },
                description: {
                    type: 'textarea',
                    title: 'Description',
                    required: true
                },
                image: {
                    type: 'file',
                    title: 'Choose an Image',
                    required: true
                }
            }
        },
        eventBtnTooltip() {
            return this.range ? '' : 'Select a range of dates';
        },
        title() {
            const range = this.rangeFormat(this.range);
            console.log(range);
            return 'Create an Event for '+ range;
        }
    },
    methods: {
        async onUpload(outputs, inputsChanged) {
            if (!inputsChanged) {
                this.show = false;
                return;
            }

            if (!this.range) {
                this.error = "Must select a range of dates";
                return;
            }

            try {
                const formData = new FormData();
                
                if (typeof outputs.image === 'object')
                    formData.append('image', outputs.image, outputs.image.name);
                
                formData.append('title', outputs.title);
                formData.append('description', outputs.description);
                formData.append('startDate', this.range.start);
                formData.append('endDate', this.range.end);
                // if (this.editRoom) {
                //     await axios.put('/api/events/' + this.editRoom._id, formData);
                // }
                // else {
                    await axios.post("/api/events", formData);
               // }

                this.show = false;
                await this.getEvents();
            } catch (error) {
                console.log(error);
                this.error = "Error: " + error.response.data.message;
            }                        
        },
        onNew() {
            if (!this.range) return;
            this.show = true;
        },
        transformEvent(event) {
            return {
                _id: event._id,
                date: {
                    //The back-end is in utc time, so use that
                    start: dayjs.utc(event.startDate).toDate(),
                    end: dayjs.utc(event.endDate).toDate()
                },
                user: event.user,
                color: null,
                label: `${event.title}`,
                data: event
            }
        },
        async getEvents() {
            try {
                const response = await axios.get('/api/events');

                this.events = response.data.map(x => this.transformEvent(x));
                this.events.push({date: new Date()});
            } catch(err) {
                console.log(err);
            }
        },
        rangeFormat
    }
}
</script>

<style scoped>
.w-125 {
    width: 125px;
}
</style>