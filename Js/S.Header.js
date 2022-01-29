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

    const newMenuTab = `<li class="nav-item" id="nav-home">
                            <a class="nav-link" name='' href="/"></a>
                        </li>`;

    let lastTab = "home";
    let _template = $(template);
    
    let createTab = function (name, label, path, active) {
        const newTab = $(newMenuTab).find(":first-child");
        newTab.attr({'name': name, 'href': path});
        newTab.html(label);

        if (active) {
            newTab.addClass("active");
        }

        _template.find("#navbarNav ul").append(newTab);
    }

    let onMenuClick = function (e) {
        const currTab = $(e.target).attr("name");

        $(e.target).addClass("active");
        $(`[name="${lastTab}"]`).removeClass("active");

        lastTab = currTab;
    }

    var _header = function() {
        createTab('home', "Home", '/', true);
        createTab('about', "About", '/about');


        _template.find('a').on('click', onMenuClick);

        $("#header").html(_template);
    }
    
    return _header;
    
})();

let header = new S.Header();