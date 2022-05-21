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
    "cancel-fill": {
        name: "cancel-fill",
        render() {
            return (
                <span class="icon">
                    <svg class="plus" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation">
                        <path fill-rule="evenodd" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1.414-8l2.293 2.293a1 1 0 0 1-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L6.586 8 4.293 5.707a1 1 0 0 1 1.414-1.414L8 6.586l2.293-2.293a1 1 0 0 1 1.414 1.414z"></path>
                    </svg>
                </span>
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
    },
    plus: {
        name: "plus",
        render() {
            return (
                <span class="icon">
                    <svg class="plus" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" role="presentation">
                        <path fill-rule="evenodd" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM7 7H4a1 1 0 1 0 0 2h3v3a1 1 0 0 0 2 0V9h3a1 1 0 0 0 0-2H9V4a1 1 0 1 0-2 0z"></path>
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

.plus {
    fill: #87919f;
    height: 12px;
    width: 12px;
    padding-top: 1px;
}

.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

svg {
    display: block;
}

.light svg {
    fill: #fff;
}
</style>