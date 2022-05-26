<template>
    <div class="rooms-page">
        <h1>Rooms</h1>
        <div class="grid"> 
            <template v-for="rowNum in numRows">
                <div class="grid-row" :key="rowNum">
                    <div v-for="room in getRoomInRow(rowNum)" class="grid-item" :key="room._id">
                        <context-menu :on="isAdmin">
                            <ImageButton :to="`/rooms/${room._id}`" :img="room.thumbnail" :title="room.name"/>
                            <template v-slot:items>
                                <context-menu-item @click="onEdit(room)">
                                    Edit Room
                                </context-menu-item>
                                <context-menu-item>
                                    <button-confirm class="context-item-delete" @confirm="onDelete(room)" message="Are you sure you want to delete this room?">Delete Room</button-confirm>
                                </context-menu-item>
                                <context-menu-item @click="onAddRoomClick">
                                    Add Room
                                </context-menu-item>
                            </template>
                        </context-menu>
                    </div>
                    <div v-if="rowNum == numRows && isAdmin" class="grid-item">
                        <ImageButton @click="onAddRoomClick" name="Add Room" /> 
                    </div>
                </div>                
            </template>
        </div>
        <Modal :show="show">
            <Uploader @close="close" @submit="onUpload" :inputs="inputs" title="Add a room" :error="error"/>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios'

import ImageButton from "@/components/ImageButton.vue"
import Uploader from "@/components/Uploader.vue"
import Modal from "@/components/Modal.vue"
import ContextMenu from '@/components/ContextMenu.vue'
import ContextMenuItem from '@/components/ContextMenuItem.vue'
import ButtonConfirm from '@/components/ButtonConfirm.vue'

export default {
    name: "RoomsView",
    components: {
        ImageButton,
        Uploader,
        Modal,
        ContextMenu,
        ContextMenuItem,
        ButtonConfirm
    },
    data() {
        return {
            rooms: [],
            show: false,
            editRoom: null,
            error: '',
        }
    },
    async created(){
        await this.getRooms();
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
            this.onEdit(null);
        },
        close() {
            this.show = false;
        },
        async onUpload(outputs, inputsChanged) {
            try {                
                if (!inputsChanged) {
                    this.show = false;
                    return;
                }

                const formData = new FormData();
                
                if (typeof outputs.image === 'object')
                    formData.append('image', outputs.image, outputs.image.name);
                if (outputs.thumbnail && typeof outputs.thumbnail === 'object')
                    formData.append('thumbnail', outputs.thumbnail, outputs.thumbnail.name);                
                
                formData.append('name', outputs.name);
                formData.append('description', outputs.description);

                if (this.editRoom) {
                    await axios.put('/api/rooms/' + this.editRoom._id, formData);
                }
                else {
                    await axios.post("/api/rooms", formData);
                }

                this.show = false;
                await this.getRooms();
            } catch (error) {
                console.log(error);
                this.error = "Error: " + error.response.data.message;
            }            
        },
        onEdit(room) {
            if (!this.isAdmin) {
                return;
            }
            
            this.editRoom = room;
            this.show = true;
        },
        async onDelete(room) {
            if (!this.isAdmin) {
                return;
            }
            
            try {
                await axios.delete('/api/rooms/' + room._id);

                await this.getRooms();
            } catch(error) {
                console.log(error);
            }
        }
    },
    computed: {
        inputs() {
            return {
                name: {
                    type: 'input',
                    title: 'Name',
                    value: this.editRoom && this.editRoom.name,
                    required: true
                },
                description: {
                    type: 'textarea',
                    title: 'Description',
                    value: this.editRoom && this.editRoom.description,
                    required: true
                },
                image: {
                    type: 'file',
                    title: 'Choose an Image',
                    value: this.editRoom && this.editRoom.image,
                    required: true
                },
                thumbnail: {
                    type: 'file',
                    title: 'Choose a Thumbnail',
                    value: this.editRoom && this.editRoom.thumbnail                    
                },
            }
        },
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
.grid {
    margin-top: 30px;
}

.grid-row {
    display: flex;
    flex-direction: column;  
}

.grid-item {
    display: flex;
    justify-content: center;
}

.context-item-delete {
    background-color: transparent;
    padding: 0;
}

@media only screen and (min-width: 960px) {
    .grid-row {
        flex-direction: row;
    }
}
</style>