S.ImageButton = function (options) {
    const template = `
    <div class="image-button-container">
        <a name="image-button" class="image-button center-center">            
            <div name="image-button-text" class="image-button-text center-center"></div>
        </a>
    </div>
    `;

    let _options = options;
    let _template = $(template);

    //Give the button a name and path
    let button = _template.find("a");
    button.attr("name", `image-button${_options.id}`);
    button.attr("href", _options.path);

    //If there is an image, put that on
    if (_options.img) {
        let img = $("<img>").attr("src", _options.img);
        _template.append(img);
        button.addClass("no-color");
    }

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