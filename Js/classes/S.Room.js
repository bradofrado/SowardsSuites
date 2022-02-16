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
        let _thumbnail = options.thumbnail;
        let _otherImgs = options.imgs;
        let _amenities = options.amenities;
        let _bookings = options.bookings;
        let _path = options.path;

        let _extend = function() {
            $.extend(_self, {
                name: _name,
                description: _description,
                mainImg: _mainImg,
                thumbnail: _thumbnail,
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

S.Room.createFromApi = function(results, mapping) {
    const rooms = [];
    for (let result of results) {
        const settings = {};
        for (let map in mapping) {
            settings[map] = result[mapping[map]];
        }

        rooms.push(new S.Room(settings));
    }

    return rooms;
}