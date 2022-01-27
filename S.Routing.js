S.Routing = (function () {
    const routers = {};
    const views = {};
    
    this.view = function(name, id, templateFunction, path) {
        views[name] = {content: templateFunction, id: id};
    
        if (path) {
            route(path, templateFunction);
        }
    }
    
    this.route = function(path, template, id) {
        if (typeof template === "function")
        {
            routers[path] = {content: template, id: id};
        }
        else if (typeof template === "string")
        {
            routers[path] = {content: views[template].content, id: id};
        }
    }
    
    this.router = function() {
        const path = window.location.hash.slice(1) || "/";
    
        let view = routers[path];
    
        if (view === undefined) {
            view = views['404'];
        }
    
        const id = view.id ? view.id : S.app;
    
        $(id).html(view.content());
    }

    this.view('404', null, function () {
        return `<div>
                    <h1>404 File Not Found</h1>
                    <p>Sorry, the file you are looking for does not exist</p>
                </div`
    })

    this.view('home', null, function () {
        return "<h1>Home</h1>";
    })
    
    this.route('/', 'home');
    
    this.route('/index.html', 'home');

    this.route('/home', 'home');

    window.addEventListener('load', this.router);
    window.addEventListener('hashchange', this.router);    
});

let r = new S.Routing();

S.Routing.view = function(name, id, templateFunction, path) {
    r.view(name, id, templateFunction, path);
}

S.Routing.path = function(path, template, id) {
    r.path(path, template, id);
}

S.Routing.route = function () {
    r.router();
}