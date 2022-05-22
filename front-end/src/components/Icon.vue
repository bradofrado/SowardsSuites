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
    },
    edit: {
        name: "edit",
        render() {
            return (
                <span class="icon">
                <svg class="plus" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 348.882 348.882" style="enable-background:new 0 0 348.882 348.882;" xml:space="preserve">
                    <g>
                        <path d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231 c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685 c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176 C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99 L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386 c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z"/>
                        <path d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904 c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15 s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798 c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z"/>
                    </g>
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