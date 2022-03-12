<template>
    <div class="room-container">
        <div class="room-main-image"><img name="main-image" :src="`/images/${room.img}`"/></div>
        <div class="room-intro-container">
            <div class="room-name-container">
                <h1 name="room-name">{{room.name}}</h1>
            </div>
            <div class="room-description-container">
                <p name="room-description">{{room.description}}</p>
            </div>
        </div>
        <div class="room-amenities"></div>
    </div>
</template>

<script>
export default {
    name: "RoomView",
    computed: {
        room() {
            return this.$root.$data.rooms.find(x => x.id === parseInt(this.$route.params.id));
        }
    },
    mounted() {
        this.$root.$data.isLoading = false;
    }
}
</script>