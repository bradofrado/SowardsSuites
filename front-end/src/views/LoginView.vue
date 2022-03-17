<template>
    <div class="login-page">
        <h1>Log in</h1>
        <p>Welcome to Sowards' Suites</p>
        <div class="signin-container">
            <form class="d-flex flex-column">
                <div class="form-field">
                    <input type='text' value='' name="username" placeholder="Email"/>
                </div>
                <div class="form-field">
                    <input type='password' value='' name="password" placeholder="Password"/>
                </div>
                <button type="submit" class="button button-primary">Log in</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginView",
    mounted() {
        this.$root.$data.isLoading = false;
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