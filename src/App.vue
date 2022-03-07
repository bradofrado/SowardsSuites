<template>
    <div id="app">
        <b-navbar class="bg-primary-dark" toggleable="lg" type="dark">
            <div class="container header-container">
                <b-navbar-brand href="#">Soward's Suites</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item to="/rooms">Rooms</b-nav-item>
                    <b-nav-item to="/book">Book</b-nav-item>
                    <b-nav-item to="/about">About</b-nav-item>
                    <b-nav-item to="/login">Login</b-nav-item>
                </b-navbar-nav>
                </b-collapse>
                </div>
        </b-navbar>
        <router-view/>
    </div>
</template>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; 
  color: #2c3e50; */
}
html {
    font-size: 14px;
}

body {
    /* background-color: #f7f7f7; */
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: "Segoe UI", serif;
    margin: 0px;
}

h1,h2,h3,h4,h5,h6 {
    text-align: center;
    margin: 10px 0;
}

.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    flex-wrap: nowrap;
}

/* #app {
    flex: 1;
    margin-top: 20px;
    margin-bottom: 20px;
} */

/* img {
    width: 100%;
} */

button {
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #fff;
}

.navbar-dark .navbar-nav .nav-link.router-link-exact-active,
.navbar-dark .navbar-nav .nav-link.router-link-exact-active:focus {
    color: #fff;
}


.button-primary {
    background-color: #0f8aa0;
    height: 2.5rem;
    color: #fff;
    margin: 1rem 0;
    font-weight: 500;
}

.button-primary:hover {
    background-color: #18c6e5;
}

button.nav-link {
    border: none;
    background-color: transparent;
}

button:focus, button:focus-visible {
    outline: none;
}

.container.header-container {
    max-width: 100%;
    min-height: 80px;
}

.navbar-collapse {
    justify-content: flex-end;
    margin-right: 20px;
}

.navbar-toggler-container {
    border: none;   
}

.navbar-dark .navbar-toggler {
    color: rgba(255, 255, 255, .8);
    border: none;
}

button.navbar-toggler {
    padding: .75rem 0;
}

.navbar-toggler-label {
    margin-right: 10px;
    font-size: 1rem;
}

.bg-primary-dark {
    background-color: #0f8aa0;
}
</style>
