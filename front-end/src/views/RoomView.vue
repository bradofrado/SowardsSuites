<template>
    <div class="room-container" v-if="room">
        <div class="room-main-image">
            <img :src="room.image"/>
        </div>
        <div class="room-intro-container">
            <div class="room-name-container">
                <h1 name="room-name">{{room.name}}</h1>
            </div>
            <hr/>
            <div class="room-description-container">
                <p name="room-description">{{room.description}}</p>
            </div>
        </div>
        <div class="room-amenities"></div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "RoomView",
    data() {
        return {
            room: null
        }
    },
    created() {
        this.getRoom();
    },
    methods: {
        async getRoom() {
            try {
                const response = await axios.get('/api/rooms');
                this.room = response.data.find(x => x._id === this.$route.params.id);
                this.$root.$data.isLoading = false;
                return true;
            } catch(error) {
                //console.log(error);
                return false;
            }
        }
    },
}
</script>

<style scoped>
.room-container {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
}

.room-main-image {
    width: 66.66666%;
    padding-right: 15px;
}

.room-intro-container {
    display: flex;
    flex-direction: column;
    padding-left: 15px;
    width: 33.333333%;
}

.room-description-container {
    min-height: 100px; 
    padding-top: 10px;
}

img {
    width: 100%;
}
</style>