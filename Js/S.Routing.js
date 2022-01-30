S.Routing = (function () {
    const routers = {};
    const views = {};

    RegExp.prototype.execAll = function(s) {
        let match;
        let all = [];
        while ((match = this.exec(s)) != null) {
            all.push(match);
        }

        return all
    }

    let keyValuesToObject = function(keys, values) {
        let result = {};
        for (let i = 0; i < keys.length; i++)
        {
            result[keys[i]] = values[i];
        }

        return result;
    }

    let getParamNames = function (optionalRoute) {
        const re = /{[^{}]*}/mg
        const a = re.execAll(optionalRoute);

        const b = a.map(x => 
            /(?<={)(.*)(?=})/g.exec(x)[0]
            );

        return b;
    }

    let getParamValues = function (path, paramPath) {
        let withoutParams = paramPath.split(/{.*}/);

        for (let i = 0; i < withoutParams.length; i++)
        {
            const re = new RegExp(withoutParams[i]);
            const e = re.exec(path);
            path = path.replace(e[0], '');
        }
        path ='/' + path.replace('/', '//') + '/';

        return /\/[^\/]*\//mg.execAll(path).map(x => /(?<=\/)(.*)(?=\/)/mg.exec(x[0])[0]);
    }

    let findOptionalRoute = function(path) {
        const optionalRoutes = Object.keys(routers).filter(route => route.includes("{") && route.includes("}"));

        if (optionalRoutes.length === 0)
        {
            return null;
        }

        for (let i = 0; i < optionalRoutes.length; i++)
        {
            const _path = optionalRoutes[i];

            const regex = new RegExp(_path.replaceAll(/{.*}/g, '.*').replaceAll('/', '\/'));

            const e = regex.exec(path);
            if (e != null)
            {
                let paramNames = getParamNames(_path);
                let paramValues = getParamValues(path, _path);

                let route = routers[Object.keys(routers).find(r => r === _path)];
                let view = views[Object.keys(views).find(view => view === route.name)];

                if (view === null)
                {
                    view = {content: route.content}
                }

                return {...view, options: keyValuesToObject(paramNames, paramValues)};
            }
        }
    }
    
    this.view = function(name, id, templateFunction, path) {
        views[name] = {content: templateFunction, id: id};
    
        if (path) {
            this.route(path, name);
        }
    }
    
    this.route = function(path, template) {
        if (path[0] != "/")
        {
            throw "All paths must start with /";
        }

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

        //If this route doesn't exit, return the 404 error page
        if (route === undefined) {
            view = findOptionalRoute(path);

            if (view == null) {
                view = views['404'];
            }            
        }
        else {
            //Try and get the view that has this route
            let viewName = route.name;

            //If there is no view with this route, just return the route content
            if (viewName === undefined)
            {
                view = {content: route.content};
            }
            //Otherwise return the view
            else {
                view = views[viewName];
            }
        }                
    
        const id = view.id ? view.id : S.app;
    
        $(id).html(view.content(view.options));        
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