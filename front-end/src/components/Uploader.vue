<template>
<div>
    <form class="pure-form" @submit.prevent="onSubmit">
        <legend>{{title}}</legend>
        <template v-for="(input, index) of theInputs" >
            <fieldset :key="index">
                <input v-if="input.type == 'input'" v-model="input.value" :placeholder="input.title"/>
                <textarea v-else-if="input.type == 'textarea'" v-model="input.value" :placeholder="input.title"></textarea>            
            </fieldset>
        </template>
        <div class="imageInputContainer">
            <template v-for="(input, index) of theInputs" >
                <fieldset :key="index">
                    <file-input v-if="input.type == 'file'" v-model="input.value" :title="input.title" />  
                    <calendar v-else-if="input.type == 'calendar'" v-model="input.value" />        
                </fieldset>
            </template>
        </div>
        <p v-if="submitError" class="error">{{submitError}}</p>
        <fieldset class="buttons">
            <button type="button" @click="$emit('close')" class="button button-secondary">Close</button>
            <button type="submit" class="button button-primary">Submit</button>
        </fieldset>
    </form>
</div>
</template>

<script>
//import axios from 'axios';
import FileInput from "@/components/FileInput.vue"
import {Copy} from '@/dateFormat.js';
import Calendar from './Calendar.vue';

export default {
    name: 'Uploader',
    props: {
        //room: Object,
        title: String,
        inputs: Object,
        error: String,
    },
    components: {
        FileInput,
        Calendar,
    },
    data() {
        return {
            submitError: '',
            theInputs: {}
        }
    },
    created() {
        this.submitError = this.$props.error;
        this.theInputs = Copy(this.$props.inputs);
    },
    watch: {
        error(error) {
            this.submitError = error;
        }
    },
    methods: {
        // onImageUpload(image) {
        //     this.image = image;
        // },
        // onThumbnailUpload(thumbnail) {
        //     this.thumbnail = thumbnail;
        // },        
        onSubmit() {
            let output = {};    
            let inputsChanged = false;
            for (const name in this.theInputs) {
                const input = this.theInputs[name];

                //Validate all of the fields
                //TODO: highlight the exact input in red
                if (input.required && !input.value) {
                    this.submitError = "Please fill out all fields";
                    return;
                }

                if (input.value !== this.$props.inputs[name].value) {
                    inputsChanged = true;
                }

                output = {...output, [name]: input.value };
            }

            this.$emit('submit', output, inputsChanged);
        }
    }
}
</script>

<style scoped>
/* Form */

.pure-form legend {
    display: block;
    width: 100%;
    padding: 0.3em 0;
    margin-bottom: 0.3em;
    color: #333;
    border-bottom: 1px solid #e5e5e5;
}

.pure-form fieldset {
    margin: 0;
    padding: 0.35em 0 0.75em;
    border: 0;
}

.pure-form input:not([type]) {
    padding: 0.5em 0.6em;
    display: inline-block;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 3px #ddd;
    box-shadow: inset 0 1px 3px #ddd;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.pure-form input:not([type]):focus {
    outline: 0;
    border-color: #129fea;
}

.pure-form input[type=color], .pure-form input[type=date], .pure-form input[type=datetime-local], .pure-form input[type=datetime], .pure-form input[type=email], .pure-form input[type=month], .pure-form input[type=number], .pure-form input[type=password], .pure-form input[type=search], .pure-form input[type=tel], .pure-form input[type=text], .pure-form input[type=time], .pure-form input[type=url], .pure-form input[type=week], .pure-form select, .pure-form textarea {
    padding: 0.5em 0.6em;
    display: inline-block;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 3px #ddd;
    box-shadow: inset 0 1px 3px #ddd;
    border-radius: 4px;
    vertical-align: middle;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.pure-form input[type=color]:focus, .pure-form input[type=date]:focus, .pure-form input[type=datetime-local]:focus, .pure-form input[type=datetime]:focus, .pure-form input[type=email]:focus, .pure-form input[type=month]:focus, .pure-form input[type=number]:focus, .pure-form input[type=password]:focus, .pure-form input[type=search]:focus, .pure-form input[type=tel]:focus, .pure-form input[type=text]:focus, .pure-form input[type=time]:focus, .pure-form input[type=url]:focus, .pure-form input[type=week]:focus, .pure-form select:focus, .pure-form textarea:focus {
    outline: 0;
    border-color: #129fea;
}



.imageInputContainer {
    display: flex;
}

input, textarea {
    width: 100%;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.error {
    color: red;
}
</style>
