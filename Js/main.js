(function () {
    let rooms = window.history.state && window.history.state.rooms ? window.history.state.rooms : null;
    const apiKey = 'sandb_vv0yHixtw0Ta5Nuo8x9HffXY8XOY3O6Blfazx9kS';
    
    const _getRooms = async function() {
        if (rooms === null) {
            const apiData = await fetchData();
            rooms = S.Room.createFromApi(apiData.result, {
                name: "hotel_name", img: "max_photo_url", 
                thumbnail: "max_1440_photo_url",
                description: "unit_configuration_label",
            });
            // rooms = [
            //     new S.Room({name: "Room 1", path: "/rooms/0", img: "/images/room1.jpg", description: "A lovely room"}),
            //     new S.Room({name: "Room 2", path: "/rooms/1", img: "/images/room2.jpg", description: "Yes good"}),
            //     new S.Room({name: "Room 3", path: "/rooms/2", img: "/images/room3.jpg", description: "The best one"}),
            //     new S.Room({name: "Room 4", path: "/rooms/3", img: "/images/room4.jpg", description: "Oh baby yes"}),
            // ];
            //S.saveState({rooms: rooms}, '');
            
        }

        return rooms;
    }

    const fetchData = function() {
        return fetch("https://booking-com.p.rapidapi.com/v1/hotels/search?checkout_date=2022-08-06&room_number=1&filter_by_currency=AED&dest_type=city&locale=en-gb&checkin_date=2022-08-05&adults_number=2&order_by=popularity&units=metric&dest_id=-553173&children_number=2&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1&children_ages=5%2C0&include_adjacency=true&page_number=0", {
            "method": "GET",
            "headers": {
            "x-rapidapi-host": "booking-com.p.rapidapi.com",
            "x-rapidapi-key": "89f9f760dfmshaab308aa5504b81p126cedjsna5ca59a18e90"
                }
        })
        .then(response => {
            return response.json();
            console.log(response);
        }).then(json => {
            return json;
        })
        .catch(err => {
            console.error(err);
        });
          
    }

    const _saveState = function(newState) {
        const state = window.history.state;
        window.history.pushState({...state, ...newState}, '');
    }

    S = {
        debug: false,
        app: "#app",
        Pages: {},
        Control: {},
        getRooms: _getRooms,
        saveState: _saveState,
    }
})();

