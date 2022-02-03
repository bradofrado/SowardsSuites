S.Pages.Rooms = (function () {
    const templatePage = 
    `<div class="rooms-page">
        <h1>Rooms</h1>
        <div name="grid" class="grid">           
        </div>
    </div>
    `;
    const templateRow = 
    `
    <div class="grid-row">        
    </div>
    `;

    const templateItem = 
    `
    <div class="grid-item"></div>
    `;

    // const buttons = [
    //     [
    //         {name: "Room 1", path: "/rooms/0", img: "/images/room1.jpg"},
    //         {name: "Room 2", path: "/rooms/1", img: "/images/room2.jpg"},
    //         {name: "Room 3", path: "/rooms/2", img: "/images/room3.jpg"}
    //     ],
    //     [
    //         {name: "Room 4", path: "/rooms/3", img: "/images/room4.jpg"}
    //     ],
    // ];
    //TODO:
    //const buttons = options.rooms
    let rooms = [];
    let roomPages = [];
    let $element = $(templatePage);
    const numRoomsPerRow = 3;

    let _getRooms = function () {
        return [
            new S.Room({name: "Room 1", path: "/rooms/0", img: "/images/room1.jpg", description: "A lovely room"}),
            new S.Room({name: "Room 2", path: "/rooms/1", img: "/images/room2.jpg", description: "Yes good"}),
            new S.Room({name: "Room 3", path: "/rooms/2", img: "/images/room3.jpg", description: "The best one"}),
            new S.Room({name: "Room 4", path: "/rooms/3", img: "/images/room4.jpg", description: "Oh baby yes"}),
        ]
    }

    let _initRooms = function() {
        let id = 0;
        for (let i = 0; i < rooms.length; i) {
            const $row = $(templateRow);
            $row.attr("name", `grid-row${i}`);

            //Loop until a new row or we run out of rooms
            for (let j = 0; j < numRoomsPerRow && i < rooms.length; j++)
            {
                const options = {...rooms[i].props, id: id};
                const $room = $(templateItem);
                $room.attr("name", `grid-item${i}`);
    
                S.Control.ImageButton.addButton($room, options);
                $row.append($room);

                roomPages.push(new S.Pages.Room({room: rooms[i]}));
    
                id++;
                i++;
            }

            S.Util.findName("grid", $element).append($row);            
        }
    }

    let init = function() {
        rooms = _getRooms();
        _initRooms();
    }
    
    init();
    
    S.Routing.view('rooms', null, function () {
        return $element;
    }, '/rooms');

    S.Routing.view("room", null, function(params) {
        return roomPages[params.roomNum].getElement();
     }, '/rooms/{roomNum}');  
})();