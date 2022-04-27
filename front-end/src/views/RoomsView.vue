<template>
    <div class="rooms-page">
        <h1>Rooms</h1>
        <div name="grid" class="grid"> 
            <template v-for="rowNum in numRows">
                <div class="grid-row" :key="rowNum">
                    <div v-for="room in getRoomInRow(rowNum)" class="grid-item" :key="room._id">
                        <ImageButton :to="`/rooms/${room._id}`" :name="room.name" :img="room.thumbnail"/>
                    </div>
                    <div v-if="rowNum == numRows && isAdmin" class="grid-item">
                        <ImageButton @click="onAddRoomClick" name="Add Room" /> 
                    </div>
                </div>                
            </template>
        </div>
        <Modal :show="show">
            <uploader @close="close" @uploadFinished="uploadFinished" />
        </Modal>
    </div>
</template>

<script>
import ImageButton from "@/components/ImageButton.vue"
import Uploader from "@/components/Uploader.vue"
import Modal from "@/components/Modal.vue"
import axios from 'axios'

export default {
    name: "RoomsView",
    components: {
        ImageButton,
        Uploader,
        Modal
    },
    data() {
        return {
            rooms: [],
            show: false
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
        },
        onAddRoomClick() {
            if (!this.isAdmin) {
                return;
            }

            this.show = true;
        },
        close() {
            this.show = false;
        },
        async uploadFinished() {
            this.show = false;
            await this.getRooms();
        }
    },
    computed: {
        numRows() {
            const numRows = Math.ceil(this.rooms.length / 3);
            return numRows;
        },
        isAdmin() {
            const user = this.$root.$data.user;

            return user && user.roles.includes("Admin");
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