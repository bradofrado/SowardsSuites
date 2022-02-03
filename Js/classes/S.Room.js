/*
options:
    name
    description
    main photo
    other photos : []
    amenities
    bookings
*/
S.Room = (function () {
    return function(options) {
        let _self = this;
        let _props = options;
        let _name = options.name;
        let _description = options.description;
        let _mainImg = options.img;
        let _otherImgs = options.imgs;
        let _amenities = options.amenities;
        let _bookings = options.bookings;
        let _path = options.path;

        let _extend = function() {
            $.extend(_self, {
                name: _name,
                description: _description,
                mainImg: _mainImg,
                imgs: _otherImgs,
                amenities: _amenities,
                bookings: _bookings,
                path: _path,
                props: _props
            });
        }

        _extend();
    };
})();