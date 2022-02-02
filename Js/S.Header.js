S.Header = (function () {       
    const template = `<nav class="navbar navbar-expand-lg navbar-dark bg-primary-dark">
                        <div class="container header-container">
                            <a class="navbar-brand" href="/">Soward's Suites</a>
                            <div class="navbar-toggler navbar-toggler-container">
                                <span class="navbar-toggler-label">Menu</span>
                                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                            </div>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul class="navbar-nav">
                                    
                                </ul>
                            </div>
                        </div>
                    </nav>`;

    let _template = $(template);
    let _menuItems = {};
    
    let createMenuItem = function (name, label, path, active) {
        const menuItem = new S.Header.MenuItem({ name: name, label: label, path: path, active: active });
        _menuItems[path] = menuItem;
        
        _template.find("#navbarNav ul").append(menuItem.render());
    }

    let getMenuItem = function(name) {
        const keys = Object.keys(_menuItems);
        let curr = null;

        for (let key of keys) {
            if (_menuItems[key].name === name) {
                curr = _menuItems[key];
                break;
            }
        }

        if (curr === null) {
            throw "There is no menu item with name";
        }
        
        return curr;
    }

    let getCurrentActive = function() {
        const keys = Object.keys(_menuItems);
        let currActive = null;
        for (let key of keys) {
            if (_menuItems[key].active) {
                currActive = _menuItems[key];
                break;
            }
        }

        return currActive;
    }

    var _header = function() {
        createMenuItem('home', "Home", '/');
        createMenuItem('rooms', "Rooms", '/rooms')
        createMenuItem('book', "Book", '/book');
        createMenuItem('about', "About", '/about');
        createMenuItem('login', 'Login', '/login');

        let onMenuClick = function (e) {
            const currTab = $(e.target).attr("name"); 
            
            changeActiveMenu(currTab);
        }

        let onRouteChange = function(path) {
            const menuItem = _menuItems[path];
            
            changeActiveMenu(menuItem);
        }  
        
        let changeActiveMenu = function (menuItem) {
            const currActive = getCurrentActive();
            const nextActive = typeof menuItem === "string" ? getMenuItem(menuItem) : menuItem;

            if (currActive !== undefined && currActive !== null) {
                currActive.setActive(false);
            }

            if (nextActive !== undefined) {
                nextActive.setActive(true);     
            }       
        }

        _template.find('a').on('click', onMenuClick);

        $("#header").html(_template);

        S.Routing.onRouteChange.subscribe(onRouteChange);

        $.extend(this, {
            changeActiveMenu: changeActiveMenu
        });
    }
    
    return _header;
    
})();

S.Header.MenuItem = function(options) {
    const _template = `<li class="nav-item" id="nav-home">
                        <a class="nav-link" name='' href="/"></a>
                    </li>`;        
    
    let self = this;
    let _name = options.name;
    let _label = options.label;
    let _active = options.active;
    let _path = options.path;
    let $element = $(_template);

    let init = function() {
        $link = $element.find(":first-child");
        $link.attr({'name': _name, 'href': _path});
        $link.html(_label);

        if (_active) {
            $link.addClass("active");
        }

    }

    let _setActive = function(active) {
        if (!active) {
            $element.find(`a`).removeClass("active");            
        }
        else {
            $element.find(`a`).addClass("active");
        }
        
        _active = active;
        extend();
    }

    this.render = function() {
        return $element;
    }

    init();

    let extend = function () {
            $.extend(self, {
            name: _name,
            label: _label,
            active: _active,
            path: _path,
            setActive: _setActive
        });
    };

    extend();
};

let header = new S.Header();

S.Header.changeActiveMenu = function(menuName) {
    header.changeActiveMenu(menuName);
}

