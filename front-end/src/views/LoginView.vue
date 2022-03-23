<template>
<div class="login-page">
    <div v-if="user">
        <User/>
    </div>
    <div v-else-if="loggingIn">
        <h1>Log in</h1>
        <p>Welcome to Sowards' Suites</p>
        <div class="signin-container">
            <form class="d-flex flex-column">
                <div class="form-field">
                    <input type='text' placeholder="Username" v-model="username"/>
                </div>
                <div class="form-field">
                    <input type='password' placeholder="Password" v-model="password"/>
                </div>
                <button type="submit" class="button button-primary" @click.prevent="login">Log in</button>
                <p class="error-text" v-if="error">{{error}}</p>
                <a href="" @click.prevent="toggleLoginView">Sign up</a>
            </form>
        </div>
    </div>
    <div v-else>
        <h1>Sign Up</h1>
        <div class="signin-container">
            <form class="d-flex flex-column">
                <fieldset>
                    <div class="form-field">
                        <input type='text' placeholder="First Name" v-model="firstname"/>
                    </div>
                    <div class="form-field">
                        <input type='text' placeholder="Last Name" v-model="lastname"/>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="form-field">
                        <input type='text' placeholder="Username" v-model="username"/>
                    </div>
                    <div class="form-field">
                        <input type='password' placeholder="Password" v-model="password"/>
                    </div>
                </fieldset>
                <button type="submit" class="button button-primary" @click.prevent="login">Sign Up</button>
                <p class="error-text" v-if="error">{{error}}</p>
                <a href="" @click.prevent="toggleLoginView">Log in</a>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import User from '@/components/User.vue'

export default {
    name: "LoginView",
    components: {
        User
    },
    data() {
        return {
            password: "",
            username: "",
            error: null,
            loggingIn: true
        }
    },
    async created() {
        try {
            let response = await axios.get('/api/users');
            this.$root.$data.user = response.data.user;
            this.$root.$data.isLoading = false;
        } catch(error) {
            this.$root.$data.user = null;
            this.$root.$data.isLoading = false;
        }
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        clearAll() {
            this.username = "";
            this.password = "";
            this.firstname = "";
            this.lastname = "";
            this.error = "";
        },
        async login() {
            try {
                this.$root.$data.isLoading = true;
                const response = await axios.post('/api/users/login', {
                    username: this.username,
                    password: this.password
                });
                
                this.$root.$data.user = response.data.user;
                this.$root.$data.isLoading = false;
                
                this.clearAll();
            } catch(error) {
                console.log(error);
                this.$root.$data.user = null;
                this.$root.$data.isLoading = false;
                this.error = error.response.data.message;
            }
        },
        async register() {
            try {
                this.$root.$data.isLoading = true;
                const response = await axios.post('/api/users', {
                    username: this.username,
                    password: this.password,
                    firstname: this.firstname,
                    lastname: this.lastname
                });
                this.$root.$data.user = response.data.user;
                this.$root.$data.isLoading = false;

                this.clearAll();
            } catch(error) {
                console.log(error);
                this.$root.$data.user = null;
                this.$root.$data.isLoading = false;
                this.error = error.response.data.message;
            }
        },
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
        toggleLoginView() {
            this.loggingIn = !this.loggingIn;
            this.clearAll();
        }
    }
}
</script>

<style scoped>

.login-page {
    margin: 50px 0;
    text-align: center;
}

.login-page h1 {
    font-weight: 300;
    margin-bottom: 2rem;
}

.signin-container {
    margin: 0 auto;
    width: 300px;
    padding: 20px;
}

.login-page fieldset {
    margin:10px;
}

.form-field {
    width: 100%;
    margin-bottom: .5rem;
}

.form-field input {
    width: 100%;
    border: .5px solid #ced4da;
    border-radius: 3px;
    height: 35px;
    color: #495057;
    padding: 10px 10px;
    transition: border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
}

.form-field input::placeholder {
    color: #ced4da;
}

.form-field input:focus {
    outline: none;
    border-color: #78b7f1;
    border-radius: 2px;
    box-shadow: 0 0 3px 1px #78b7f1;
}

.error-text {
    display: inline;
    padding: 5px 20px;
    border-radius: 30px;
    font-size: 10px;
    background-color: #d9534f;
    color: #fff;
}
</style>