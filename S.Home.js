(function () {
    const template = `
    <h1>Home</h1>
    <p>You are now on the home page</p>
    <p>Thank you for watching</p>
    `

    S.Routing.view('home', null, function () {
        return template;
    }, '/')
})();