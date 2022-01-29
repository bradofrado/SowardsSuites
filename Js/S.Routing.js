S.Routing = (function () {
    const routers = {};
    const views = {};
    
    this.view = function(name, id, templateFunction, path) {
        views[name] = {content: templateFunction, id: id};
    
        if (path) {
            this.route(path, name);
        }
    }
    
    this.route = function(path, template) {
        if (typeof template === "function")
        {
            routers[path] = {content: template};
        }
        else if (typeof template === "string")
        {
            routers[path] = {content: views[template].content, name: template};
        }
    }
    
    this.router = function() {
        const path = window.location.hash.slice(1) || "/";
    
        let route = routers[path];
        let view;

        if (route === undefined) {
            view = views['404'];
        }
        else {
            let viewName = route.name;

            if (viewName === undefined)
            {
                view = {content: route.content};
            }
            else {
                view = views[viewName];
            }
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