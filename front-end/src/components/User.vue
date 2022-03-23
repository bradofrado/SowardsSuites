<template>
    <div v-if="user">
        <h1>Welcome, {{user.firstname}}!</h1>
        <a href="" @click.prevent="logout">Log out</a>
    </div>
    <div v-else>
        <h1>Not logged in!</h1>
    </div>
</template>

<script>
export default {
    name: "User",
    computed: {
        user() {
            return this.$root.$data.user;
        }
    }
}
</script>
