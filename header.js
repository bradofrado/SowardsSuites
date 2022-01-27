(function () {
    let lastTab = "home";
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
                                    <li class="nav-item" id="nav-home">
                                        <a class="nav-link active" name='home' href="/">Home</a>
                                    </li>
                                    <li class="nav-item" id="nav-portfolio">
                                        <a class="nav-link" name='portfolio' href="/portfolio">Portfolio</a>
                                    </li>
                                    <li class="nav-item" id="nav-reviews">
                                        <a class="nav-link" name='reviews' href="/reviews">Reviews</a>
                                    </li>
                                    <li class="nav-item" id="nav-about">
                                        <a class="nav-link" name='about' href="/about">About</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>`;

    let onMenuClick = function (e) {
        const currTab = $(e.target).attr("name");

        $(e.target).addClass("active");
        $(`[name="${lastTab}"]`).removeClass("active");

        lastTab = currTab;
    }

    const header = $("<div>").append(template);
    header.find('a').on('click', onMenuClick);

    $("#header").html(header);
})();