S.Home.Button = function (options) {
    const template = `
    <a name="home-button" class="home-button">
        <div name="home-button-text" class="home-button-text"></div>
    </a>
    `;

    let _options = options;
    let _template = $(template);

    _template.attr("name", `home-button${_options.id}`);
    _template.attr("href", _options.path);

    let text = S.Util.findName("home-button-text", _template);
    text.attr("name", `home-button-text${_options.id}`);
    text.html(_options.name);

    this.render = function() {
        return _template;
    }
};