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

    if (view === undefined) {
        return;
    }

    const id = view.id ? view.id : myApp;

    $(id).html(view.content());
}

let onLoad = function () {
    fixHref("body");
    router();
}

window.addEventListener('load', onLoad);
window.addEventListener('hashchange', router);

route('/', function() {
    return "<a href='/home'>Hello, World</div>";
})

var fixHref = function(target) {
    const atags = $(target).find('a');

    for (let i = 0; i < atags.length; i++)
    {
        const oldHref = $(atags[i]).attr('href');
        $(atags[i]).attr('href', `#${oldHref}`);
    }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(function (mutationsList, observer) {
    fixHref(mutationsList[0].target);
});
const config = {attributes: true, childList: true, subtree: true};

// Start observing the target node for configured mutations
observer.observe(document.getElementById('app'), config);