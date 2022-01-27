const myApp = "#app";

const routers = {};
const views = {};

var view = function(name, id, templateFunction, path) {
    views[name] = {content: templateFunction, id: id};

    if (path) {
        route(path, templateFunction);
    }
}

var route = function(path, template, id) {
    if (typeof template === "function")
    {
        routers[path] = {content: template, id: id};
    }
    else if (typeof template === "string")
    {
        routers[path] = {content: views[template].content, id: id};
    }
}

let router = function() {
    const path = window.location.hash.slice(1) || "/";

    const view = routers[path];
    const id = view.id ? view.id : myApp;

    $(id).html(view.content());
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

route('/', function() {
    return "<a href='/home'>Hello, World</div>";
})