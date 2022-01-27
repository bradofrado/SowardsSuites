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

    let view = routers[path];

    if (view === undefined) {
        view = views['404'];
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

view('404', null, function () {
    return `<div>
                <h1>404 File Not Found</h1>
                <p>Sorry, the file you are looking for does not exist</p>
            </div`
})

route('/', function() {
    return "<a href='/home'>Hello, World</div>";
})

route('/portfolio', function () {
    return "<div>I am in the Portfolio</div><a href='/'>Return Home</a>"
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