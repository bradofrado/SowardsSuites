S.Pages.Login = (function () {
    const template = 
    `<div class="login-page">
        <h1>Log in</h1>
        <p>Welcome to Sowards' Suites</p>
        <div class="signin-container">
            <form class="d-flex flex-column">
                <div class="form-field">
                    <input type='text' value='' name="username" placeholder="Email"/>
                </div>
                <div class="form-field">
                    <input type='text' value='' name="password" placeholder="Password"/>
                </div>
                <button type="submit" class="button button-primary">Log in</button>
            </form>
        </div>
    </div>
    `

    let _template = $(template);

    S.Routing.view('login', null, function () {
        return _template;
    }, '/login')
})();