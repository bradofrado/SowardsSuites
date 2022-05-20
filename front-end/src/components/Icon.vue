<template>
    <component :is="name"/>
</template>

<script>
const icons = {
    cancel: {
        name: "cancel",
        render() {
            return (
                <svg class="m-2 arrow-svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            )
        }
    },
    arrowRight: {
        name: "arrow-right",
        render() {
            return (
                <span class="flex-shrink-0 m-2">
                    <svg class="arrow-svg" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            )
        }
    }
}

export default {
    name: "Icon",
    props: {
        name: String
    },
    components: icons,
}
</script>

<style>
.arrow-svg {
    stroke: currentColor;
    height: 1rem;
    width: 1rem;
}

svg {
    display: block;
}
</style>