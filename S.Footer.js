S.Footer = (function () {
    const template = `<div>Footer</div>`
    let _template = $(template);

    var _footer = function (id) {
        id = id ? id : "#footer";
        $(id).html(_template);
    }

    return _footer;
})();

var footer = new S.Footer();