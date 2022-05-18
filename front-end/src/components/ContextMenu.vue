<template>
    <div @contextmenu="openMenu" >
        <div class='context-menu' v-show="show" :style="{top: top, left: left}"  ref="menu" @blur="close" tabindex='-1' >
            <ul class='context-items'>
                <slot name="items"></slot>
            </ul>
        </div>
        
        <slot></slot>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: "ContextMenu",
    props: {
        on: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            show: false,
            top: '0px',
            left: '0px'
        }
    },
    created () {
        window.addEventListener('scroll', this.close);
    },
    destroyed () {
        window.removeEventListener('scroll', this.close);
    },
    methods: {
        openMenu(e) {
            if (!this.$props.on) {
                return;
            }

            e.preventDefault();

            if (this.show) {
                this.close();
                return;
            }

            this.show = true;
            
            Vue.nextTick(function() {
                this.setMenu(e.y, e.x)
                this.$refs.menu.focus();
                //this.$el.focus();

                
            }.bind(this));
        },
        setMenu(top, left) {
            this.top = top + 'px';
            this.left = left + 'px';
        },
        close() {  
            setTimeout(() => {
                this.show = false;
            }, 50);     
            Vue.nextTick(function() {
               //this.setMenu(0,0);               
            }.bind(this));
        }
    }
}
</script>

<style scoped>
.context-menu {
    position: fixed;
    background: white;
    z-index: 999;
    outline: none;
    cursor: pointer;
    width: 250px;
    padding: 10px 20px;
    margin:0px;
    border-width: 1px;
    border-radius: 5px;
}

.context-items {
    list-style: none;
    padding:0px;
    margin:0px;
}
</style>