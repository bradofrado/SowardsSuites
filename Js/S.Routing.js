S.Routing = (function () {
    const routers = {};
    const views = {};
    const self = this;

    RegExp.prototype.execAll = function(s) {
        let match;
        let all = [];
        while ((match = this.exec(s)) != null) {
            all.push(match);
        }

        return all
    }

    String.prototype.betweenAll = function(s1, s2) {
        let s = this;
        let regex = new RegExp(`${s1}[^${s1}${s2}]*${s2}`, 'mg');
        return regex.execAll(s).map(x => x[0].substring(1,x[0].length - 1));
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
        //return everything in between { and }
        return optionalRoute.betweenAll('{', '}');
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

        //return everything in between the / and / characters
        return path.betweenAll('/', '/');
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

    let onATagClick = function(e) {
        e.preventDefault();
        const $self = $(this);
        const href = $self.attr('href');
        S.Routing.changeRoute(href);
    }

    let fixATags = function($element) {
        $element.find('a').off('click', onATagClick);
        $element.find('a').on('click', onATagClick);
    }

    let onLoad = function() {
        fixATags($('body'));
        self.router();
    }

    let renderElement = function($element, id) {
        $element = typeof $element === "String" ? $($element) : $element;
        fixATags($element);
    
        $(id).html($element); 
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
        const path = window.location.pathname || "/";
    
        let route = routers[path];
        let view;

        //If this route doesn't exit, return the 404 error page
        if (route === undefined) {
            view = findOptionalRoute(path);

            if (view == null) {
                view = views['404'];
                route = null;
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
        
        S.Routing.onRouteChange.call(path);
    
        const id = view.id ? view.id : S.app;

        //Get the element and make all the a tags do our custom routing 
        let value = view.content(view.options);

        //If the page content returned a promise, load the screen until we are 
        //ready to render
        if (value.then) {
            value.then($element => {
                 renderElement($element, id);
            }).catch(err => {
                console.log(err);
            });

            const loader = new S.Control.Loading();
            $(id).html(loader.render());
        }
        //Otherwise display the element returned
        else {
            renderElement(value, id); 
        }
              
        
    }

    this.view('404', null, function () {
        return `<div>
                    <h1>404 File Not Found</h1>
                    <p>Sorry, the file you are looking for does not exist</p>
                </div`
    });

    this.view('home', null, function () {
        return "<h1>Home</h1>";
    });

    const init = function() {
        self.route('/', 'home');
        self.route('/index.html', 'home');
        self.route('/home', 'home');

        window.addEventListener('load', onLoad);
        window.addEventListener('popstate', self.router);   
    }
    
    init();

     
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

S.Routing.changeRoute = function(path) {
    if (path !== window.location.pathname) {
        const state = window.history.state;
        window.history.pushState(state, '', path);
        r.router();
    }
}

S.Routing.handleRouteChange = function () {
    let subscriptions = [];

    let _subscribe = function (f) {
        subscriptions.push(f);
    }

    let _call = function (path) {
        for (let f of subscriptions) {
            f(path);
        }
    }

    $.extend(this, {
        subscribe: _subscribe,
        call: _call
    });
};
let h = new S.Routing.handleRouteChange();

S.Routing.onRouteChange = h;