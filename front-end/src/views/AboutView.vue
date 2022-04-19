<template>
    <div class="about-page">
        <h1>About</h1>
        <p>Sowards' Suites is a website that lets <strong>you</strong> be in control of where you will be staying
            during the next Sowards visit. With the Lemberholes' recent move in, it is more important than ever to 
            reserve your favorite, limited offer room.</p>
        <p>Navigate over to the Rooms page to see all of the possible rooms. (Yes even the Lemperholes' room can be reserved.
            Shh, don't tell them!) Upon clicking on the room you will find information about the room and lovely pictures.
            You can see the availablity and book the room there, or you can navigate over to the Book tab and see what is available
            based on a specific date.</p>
        <p>We hope you will enjoy your stay here at the Sowards' Suite. We know Mamma Llamma will for sure.</p>
    </div>
</template>

<script>
export default {
    name: "AboutView",
    mounted() {
        this.$root.$data.isLoading = false;
    }
}
</script>

<style scoped>
.about-page h1, p {
    margin-bottom: 2rem;
}

@media only screen and (min-width: 960px) {
    .about-page {
        margin: auto 250px;
    }
}
</style>