<template>
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
                    <slot name="label" :label="attr.customData.label" :data="attr.customData.data" :hide="hide"> 
                         <span>{{attr.customData.label}}</span>
                    </slot>                   
                </popover-row>
            </div>
        </template>
    </v-date-picker>
</template>

<script >
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min';

export default {
    name: "Calendar",
    props: {
        screens: Number,
        value: Object,
        days: Array,
        edit: Object
    },
    data() {
        return {
            range: this.value,
            currUsers: {}, 
            color: 'blue',
            colors: ['blue', 'red', 'orange', 'yellow', 'green', 'teal', 'indigo', 'purple', 'pink', 'gray'],
        }
    },
    components: {
        PopoverRow
    },
    computed: {
        attrs() {
            const days = this.days.map((day,i) => {
                return this.getFormat(day, i);
            });
            return days;
        },
    },
    watch: {
        edit(edit) {
            if (edit) {
                this.$refs.calendar.focusDate(edit.start); 
                this.$refs.calendar.dragValue = null;
                this.range = edit;
            } 
        },
        range(range) {
            this.$emit('input', range);
        },
        value(value) {
            if (value != this.range) {
                this.range = value;
            }
        }
    },
    methods: {
        onDayClick(e) {
            if (this.$refs.calendar.isDragging) {
                this.range = null;
            }

            if (this.edit || !this.$refs.calendar.isDragging) {
                return;
            }

            this.$emit('dayclick', e);            
        },
        getFormat(day) {
            if (!day.user) {
                return {
                    dates: day.date,
                    highlight: true
                }
            }

            if (!this.currUsers[day.user.firstname]) {
                this.currUsers[day.user.firstname] = this.color;
                this.color = this.next(this.color, this.colors);
            }

            
            return {
                dates: day.date,
                bar: day.color || this.currUsers[day.user.firstname],
                popover: {
                    visibility: 'hover',                    
                },
                customData: {
                    label: day.label,
                    data: day.data
                }                
            };
        },
        next(curr, all) {
            const index = all.findIndex(x => x === curr);

            curr = index + 1 < all.length ? all[index+1] : all[0];

            return curr
        },
    }
}
</script>

<style scoped>
.center {
    display: block;
    margin: 10px auto;
}
</style>