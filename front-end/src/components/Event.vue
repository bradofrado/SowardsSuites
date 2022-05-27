<template>
    <div class="event-container">
        <h1>{{event.title}}</h1>
        <img :src="event.image"/>
        <p class="event-description">{{event.description}}</p>
    </div>
</template>

<script>
export default {
    name: "Event",
    props: {
        event: Object
    }
}
</script>

<style scoped>
.event-container {
    border-width: 3px;
    height: 100%;
}

img {
    max-width: 300px;
    max-height: 300px;
    width: 100%;
}

.event-description {
    padding: 20px;
}
</style>