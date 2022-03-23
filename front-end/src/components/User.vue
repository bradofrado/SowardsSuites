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
import axios from 'axios';

export default {
    name: "User",
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        async logout() {
            try {
                this.$root.$data.isLoading = true;
                await axios.delete('api/users');
                this.$root.$data.user = null;
            } catch(error) {
                console.log(error);
            }
            this.$root.$data.isLoading = false;
        },
    }
}
</script>
