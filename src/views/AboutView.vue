<template>
  <div class="about">
    <h1>This is an about page</h1>
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