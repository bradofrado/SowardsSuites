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
        {id: 0, name: "Rooms", path: "/rooms", img: "/images/room2.jpg"},
        {id: 1, name: "Book", path: "/book"},
        {id: 2, name: "About", path: "/about"}
    ]

    let _template = $(template);
    
    for (let i = 0; i < buttons.length; i++)
    {
        S.Control.ImageButton.addButton(_template.find(`[name="home-buttons"]`), buttons[i]);
    }

    S.Routing.view('home', null, function () {
        return _template;
    }, '/')
})();