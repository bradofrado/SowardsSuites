S.Control.Loading = (function() {
    const template = `<div>
                        <h1>Soward's Suites</h1>
                        <div class="loader"></div>
                     </div>`;

    return function() {
        const $element = $(template);


        this.render = function() {
            return $element;
        }
    }
})();