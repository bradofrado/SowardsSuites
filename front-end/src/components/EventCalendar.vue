<template>
<div>
    <calendar class="center" :days="theEvents" :screens="2" v-model="range">
        <template #label="{label, data, hide}">
            <button class="popover-label" v-if="isAdmin || (user && myEvents.includes(data))" @click="hide(), onEdit(data)">
                <span>{{label}}</span>
                <icon class="light" name="edit"/>
            </button>
        </template>
    </calendar>
    <div class="center w-125 d-flex justify-content-center">
        <button :class="'button button-primary h-2 mw-125 w-100'" @click="onNew">{{(edit ? 'Edit' : 'Create')}} Event</button>
    </div>
    <modal :show="show">
        <uploader :inputs="inputs" :title="title" @submit="onUpload" @delete="onDelete" @close="show = false, edit = false" :error="error"/>
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
import Icon from './Icon.vue';
//import DateRangeButton from './DateRangeButton.vue';

export default {
    name: "EventCalendar",
    props: {
        events: Array
    },
    data() {
        return {
            theEvents: [],
            show: false,
            range: null,
            error: '',
            edit: null
        }
    },
    components: {
        Calendar,
        Modal,
        Uploader,
        Icon,
        //DateRangeButton,
    },
    created() {
        this.theEvents = this.$props.events.map(x => this.transformEvent(x));
        this.theEvents.push({date: new Date()});

        this.$root.$data.isLoading = false;
    },
    watch: {
        show(show) {
            if (!show) {
                this.range = null;
            }
        },
        events(events) {
            this.theEvents = events.map(x => this.transformEvent(x));
            this.theEvents.push({date: new Date()});
        },
        edit(edit) {
            if (!edit) this.range = null;
        }
    },
    computed: {
        inputs() {
            return {
                title: {
                    type: 'input',
                    title: 'Title',
                    value: this.edit ? this.edit.title : null,
                    required: true
                },
                description: {
                    type: 'textarea',
                    title: 'Description',
                    value: this.edit ? this.edit.description : null,
                    required: true
                },
                image: {
                    type: 'file',
                    title: 'Choose an Image',
                    value: this.edit ? this.edit.image : null,
                    required: true
                },
                dates: {
                    type: 'calendar',
                    title: 'Dates',
                    value: this.edit ? {
                        start: dayjs.utc(this.edit.startDate).toDate(),
                        end: dayjs.utc(this.edit.endDate).toDate()
                    } : this.range,
                    required: true
                }
            }
        },
        title() {
            const range = this.rangeFormat(this.range);
            console.log(range);
            return this.edit ? 'Edit Event' : 'Create an Event';
        },
        myEvents() {
            if (!this.user) {
                return null;
            }

            const events = this.events.filter(event => event.user.username === this.user.username);
            
            return events
        },
        user() {
            return this.$root.$data.user;
        },
        isAdmin() {
            return this.user && this.user.roles.includes("Admin");
        }
    },
    methods: {
        async onUpload(outputs) {
            try {
                const formData = new FormData();
                
                if (typeof outputs.image === 'object')
                    formData.append('image', outputs.image, outputs.image.name);
                
                formData.append('title', outputs.title);
                formData.append('description', outputs.description);
                formData.append('startDate', outputs.dates.start);
                formData.append('endDate', outputs.dates.end);
                if (this.edit) {
                    await axios.put('/api/events/' + this.edit._id, formData);
                }
                else {
                    await axios.post("/api/events", formData);
                }

                this.show = false;
                this.edit = null;
                this.$emit('new');
            } catch (error) {
                console.log(error);
                this.error = "Error: " + error.response.data.message;
            }                        
        },
        async onDelete() {
            try {
                if (!this.edit) {
                    this.show = false;
                    return;
                }

                await axios.delete('/api/events/' + this.edit._id);

                this.show = false;
                this.edit = null;
                this.$emit('delete');
            } catch(error) {
                console.log(error);
                this.error = "Error: " + error.response.data.message;
            }
            
        },
        onNew() {
            this.show = true;
        },
        onEdit(event) {
            this.edit = event;
            this.show = true;
            // this.range = {
            //     start: dayjs.utc(this.edit.startDate).toDate(),
            //     end: dayjs.utc(this.edit.endDate).toDate()
            // };            
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
        
        rangeFormat
    }
}
</script>

<style scoped>
.w-125 {
    width: 125px;
}
</style>