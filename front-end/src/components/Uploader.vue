<template>
<div>
    <form class="pure-form" @submit.prevent="upload">
        <legend v-if="room">Edit {{room.name}}</legend>
        <legend v-else>Add a Room</legend>
        <fieldset>
            <input v-model="name" placeholder="Name">
        </fieldset>
        <fieldset>
            <textarea v-model="description" placeholder="Description"></textarea>
        </fieldset>
        <fieldset>
            <div class="imageInputContainer">
                <file-input :url="image" title="Choose an Image" @onUpload="onImageUpload"/>
                <file-input :url="thumbnail" title="Choose a Thumbnail" @onUpload="onThumbnailUpload"/>
            </div>
            <p v-if="error" class="error">{{error}}</p>
        </fieldset>
        <fieldset class="buttons">
            <button type="button" @click="close" class="button button-secondary">Close</button>
            <button type="submit" class="button button-primary">Submit</button>
        </fieldset>
    </form>
</div>
</template>

<script>
import axios from 'axios';
import FileInput from "@/components/FileInput.vue"

export default {
    name: 'Uploader',
    props: {
        room: Object
    },
    components: {
        FileInput
    },
    data() {
        return {
            name: '',
            description: '',
            image: null,
            thumbnail: null,
            error: '',
        }
    },
    created() {
        this.name = this.$props.room ? this.$props.room.name : '';
        this.description = this.$props.room ? this.$props.room.description : '';
        this.image = this.$props.room ? this.$props.room.image : '';
        this.thumbnail = this.$props.room ? this.$props.room.thumbnail : '';
    },
    methods: {
        onImageUpload(image) {
            this.image = image;
        },
        onThumbnailUpload(thumbnail) {
            this.thumbnail = thumbnail;
        },
        close() {
            this.$emit('close');
        },
        async upload() {
            try {
                if (!this.image || !this.thumbnail || !this.name || !this.description) {
                    this.error = "Please fill out all fields";
                    return;
                }

                const formData = new FormData();
                console.log(this.image);

                if (typeof this.image !== 'string')
                    formData.append('image', this.image, this.image.name);
                if (typeof this.thumbnail !== 'string')
                    formData.append('thumbnail', this.thumbnail, this.thumbnail.name);
                formData.append('name', this.name);
                formData.append('description', this.description);

                const room = this.$props.room;

                if (room) {
                    await axios.put('/api/rooms/' + room._id, formData);
                }
                else {
                    await axios.post("/api/rooms", formData);
                }

                this.thumbnail = null;
                this.image = null;
                this.name = "";
                this.description = "";
                this.$emit('uploadFinished');
            } catch (error) {
                console.log(error);
                this.error = "Error: " + error.response.data.message;
            }
        }
    }
}
</script>

<style scoped>
/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  transition: opacity 0.5s ease;
  display: flex;
  transition: background 0.2s ease-in-out, height 1s ease-in-out;
  transition: height 0.2s ease-in-out, width 0.2s ease-in-out;
  justify-content: center;
  transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
}

.modal-container {
  width: 50%;
  height: max-content;
  margin-top: 80px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 0.5s ease;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

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
</style>
