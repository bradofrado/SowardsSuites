<template>
<div class="login-page">
    <div v-if="user">
        <User/>
    </div>
    <div v-else-if="view =='login'">
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
				<button type="submit" class="button button-primary h-2" @click.prevent="login">Log in</button>
                <p class="error-text mt-2 mb-0" v-if="error">{{error}}</p>
				<div class="mt-1 d-flex justify-content-around">
				<a href="" @click.prevent="toggleView('signup')">Sign up</a>
				<a href="ml-1" @click.prevent="toggleView('password')">Forgot my password</a>
                </div>
            </form>
        </div>
    </div>
    <div v-else-if="view=='signup'">
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
                    <div class="form-field">
                        <input type='text' placeholder="Email" v-model="email"/>
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
                <button type="submit" class="button button-primary" @click.prevent="register">Sign Up</button>
                <p class="error-text" v-if="error">{{error}}</p>
                <a href="" @click.prevent="toggleView('login')">Log in</a>
            </form>
        </div>
    </div>
		<div v-else>
			<h1>Forgot my password</h1>
			<div class="signin-container">
			<form class="d-flex flex-column">
				<div class="form-field">
					<input type='text' placeholder="Email" v-model="email"/>
				</div>
				<p class="error-text mt-1" v-if="error">{{error}}</p>
				<button type="submit" class="button button-primary h-2" @click.prevent="sendForgotPasswordLink">Send Link</button>
				<a class="" href="mt-2" @click.prevent="toggleView('login')">Log in</a>
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
            email: "",
            error: null,
            view: "login"
        }
    },
    async created() {
        try {
            if (!this.$root.$data.user) {
                let response = await axios.get('/api/users');
                this.$root.$data.user = response.data.user;
            }
            
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
            this.email = "";
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
                //console.log(error);
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
                    email: this.email,
                    firstname: this.firstname,
                    lastname: this.lastname
                });
                this.$root.$data.user = response.data.user;
                this.$root.$data.isLoading = false;

                this.clearAll();
            } catch(error) {
                //console.log(error);
                this.$root.$data.user = null;
                this.$root.$data.isLoading = false;
                this.error = error.response.data.message;
            }
        },
		async sendForgotPasswordLink() {
			try {
				this.$root.$data.isLoading = true;
				await axios.post('/api/users/forgot', {
						email: this.email,
				});
				
				this.$root.$data.isLoading = false;
				
				this.clearAll();
				alert("Link sent!");
			} catch(error) {
				this.$root.$data.isLoading = false;
				this.error = error.response.data?.message ?? "There was an error";
			}
		},
        toggleView(newView) {
            this.view = newView;
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
</style>