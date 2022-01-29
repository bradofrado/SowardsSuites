(function () {
    const template = `
    <div>
        <div class="welcome-text">
            <h1>Welcome to Sowards' Suites</h1>
            <h4>What can we help you with?</h4>
        </div>
        <div name="home-buttons" class="home-buttons"></div>
    </div>
    `

    const buttons = [
        {id: 0, name: "Rooms", path: "/room"},
        {id: 1, name: "Book", path: "/book"},
        {id: 2, name: "About", path: "/about"}
    ]

    let _template = $(template);
    
    var _addButton = function(options) {
        var button = new S.Home.Button(options);

        _template.find(`[name="home-buttons"]`).append(button.render());
    }

    for (let i = 0; i < buttons.length; i++)
    {
        _addButton(buttons[i]);
    }

    S.Routing.view('home', null, function () {
        return _template;
    }, '/')
})();