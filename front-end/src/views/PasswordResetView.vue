<template>
    <div class="login-page">
        <div class="signin-container">
			<h1>Password Reset</h1>
			<p>Please enter in the new password for {{username}}</p>
            <form class="d-flex flex-column mt-2">
                <div class="form-field">
                    <input type='password' placeholder="Password" v-model="password"/>
                </div>
                <div class="form-field">
                    <input type='password' placeholder="Confirm Password" v-model="confirm"/>
                </div>
				<p class="error-text mt-2 mb-2" v-if="error">{{error}}</p>
                <button type="submit" class="button button-primary h-2" @click.prevent="submit">Submit</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "PasswordResetView",
    data() {
        return {
            password: "",
            confirm: "",
            error: ""
        }
    },
	async created() {
        this.$root.$data.isLoading = false;
    },
    computed: {
        token() {
            return this.$route.query.id
        },
        username() {
            return this.$route.query.username;
        }
    },
    methods: {
        async submit() {
            try {
                if (this.validate()) {
                    this.$root.$data.isLoading = true;
                    await axios.post('/api/users/reset', {
                        username: this.username,
                        id: this.token,
                        password: this.password
                    })
                    this.$root.$data.isLoading = false;
					this.$router.push('/login');
                } else {
                    this.error = "The passwords must match";
                }
            } catch(error) {
                this.$root.$data.isLoading = false;
                 this.error = error.response.data?.message ?? "There was an error";
            }
        },
        validate() {
            return this.password === this.confirm;
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

.align-left {
	text-align:left;
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