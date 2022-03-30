<template>
    <div class="rooms-page">
        <h1>Rooms</h1>
        <div name="grid" class="grid"> 
            <template v-for="rowNum in numRows">
                <div class="grid-row" :key="rowNum">
                    <div v-for="room in getRoomInRow(rowNum)" class="grid-item" :key="room._id">
                        <ImageButton :to="`/rooms/${room._id}`" :name="room.name" :img="room.thumbnail"/>
                    </div>
                </div>                
            </template>
        </div>
    </div>
</template>

<script>
import ImageButton from "@/components/ImageButton.vue"
import axios from 'axios'

export default {
    name: "RoomsView",
    components: {
        ImageButton
    },
    data() {
        return {
            rooms: []
        }
    },
    created(){
        this.getRooms();
    },
    methods: {
        async getRooms() {
            try {
                let response = await axios.get('/api/rooms');
                this.rooms = response.data;
                this.$root.$data.isLoading = false;

                return true;
            } catch(error) {
                //console.log(error);
                return false;
            }
        },
        getRoomInRow(rowNum) {
            if (rowNum === this.numRows) {
                return this.rooms.slice((rowNum - 1) * 3);
             
            }

            const rooms =  this.rooms.slice((rowNum - 1) * 3, rowNum * 3);
            return rooms;
        }
    },
    computed: {
        numRows() {
            const numRows = Math.ceil(this.rooms.length / 3);
            return numRows;
        }
    },
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