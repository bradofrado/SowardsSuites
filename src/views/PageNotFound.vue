<template>
    <div>
        <h1>404 File Not Found</h1>
        <p>Sorry, the file you are looking for does not exist</p>
    </div>
</template>

<script>
export default {
    name: "PageNotFound",
    mounted() {
        this.$root.$data.isLoading = false;
    }
}
</script>
