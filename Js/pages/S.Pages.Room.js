//Represents a single room
/*
options:
    name
    description
    main photo
    other photos : []
    amenities
    bookings
*/
S.Pages.Room = (function () {
    const template = 
    `<div class="room-container">
        <div class="room-main-image"></div>
        <div> class="room-intro-container"></div>
        
    </div>
    `;

    return function (options) {
        let _self = this;
        let $element = $(template);

        let _getElement = function () {
            return $("<h1>Not implemented</h1>");
        }

        let _init = function() {
            
        }

        _init();

        $.extend(_self, {
            getElement: _getElement
        });
    }
})();