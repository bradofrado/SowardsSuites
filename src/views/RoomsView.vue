<template>
    <div class="rooms-page">
        <h1>Rooms</h1>
        <div name="grid" class="grid"> 
            <template v-for="rowNum in numRows">
                <div class="grid-row" :key="rowNum">
                    <div v-for="room in getRoomInRow(rowNum)" class="grid-item" :key="room.id">
                        <ImageButton :to="room.path" :name="room.name" :img="room.img"/>
                    </div>
                </div>                
            </template>
        </div>
    </div>
</template>

<script>
import ImageButton from "@/components/ImageButton.vue"
export default {
    name: "RoomsView",
    components: {
        ImageButton
    },
    methods: {
        getRoomInRow(rowNum) {
            if (rowNum === this.numRows) {
                return this.$root.$data.rooms.slice((rowNum - 1) * 3);
             
            }

            const rooms =  this.$root.$data.rooms.slice((rowNum - 1) * 3, rowNum * 3);
            return rooms;
        }
    },
    computed: {
        rooms() {
            return this.$root.$data.rooms;
        },
        numRows() {
            const numRows = Math.ceil(this.$root.$data.rooms.length / 3);
            return numRows;
        }
    }
}
</script>

<style scoped>
.grid-row {
    display: flex;
    flex-direction: column;  
}

.grid-item {
    display: flex;
}

@media only screen and (min-width: 960px) {
    .grid-row {
        flex-direction: row;
    }
}
</style>