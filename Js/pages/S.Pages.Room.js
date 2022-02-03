//Page to display a single room
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
        <div class="room-main-image"><img name="main-image" src=""/></div>
        <div class="room-intro-container">
            <div class="room-name-container">
                <h1 name="room-name"></h1>
            </div>
            <div class="room-description-container">
                <p name="room-description"></p>
            </div>
        </div>
        <div class="room-amenities"></div>
    </div>
    `;

    return function (options) {
        let _self = this;
        let _room = options.room;

        let $element = $(template);

        let _getElement = function () {
            return $element;
        }

        let _init = function() {
            $name = S.Util.findName("room-name", $element);
            $description = S.Util.findName("room-description", $element);
            $mainImage = S.Util.findName("main-image", $element);

            $name.html(_room.name);
            $description.html(_room.description);
            $mainImage.attr("src", _room.mainImg);
        }

        _init();

        $.extend(_self, {
            getElement: _getElement
        });
    }
})();