S.ImageButton = function (options) {
    const template = `
    <a name="image-button" class="image-button">
        <div name="image-button-text" class="image-button-text"></div>
    </a>
    `;

    let _options = options;
    let _template = $(template);

    _template.attr("name", `image-button${_options.id}`);
    _template.attr("href", _options.path);

    let text = S.Util.findName("image-button-text", _template);
    text.attr("name", `image-button-text${_options.id}`);
    text.html(_options.name);

    this.render = function() {
        return _template;
    }
};

S.ImageButton.addButton = function(template, options) {
    let button = new S.ImageButton(options);

    const _template = template instanceof jQuery ? template : $(template);
    _template.append(button.render());
}