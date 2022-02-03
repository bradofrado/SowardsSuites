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

    const buttons = [
        [
            {name: "Room 1", path: "/rooms/0", img: "/images/room1.jpg"},
            {name: "Room 2", path: "/rooms/1", img: "/images/room2.jpg"},
            {name: "Room 3", path: "/rooms/2", img: "/images/room3.jpg"}
        ],
        [
            {name: "Room 4", path: "/rooms/3", img: "/images/room4.jpg"}
        ],
    ];
    //TODO:
    //const buttons = options.rooms
    let rooms = [];
    let $element = $(templatePage);

    let _initRooms = function() {
        let id = 0;
        for (let i = 0; i < buttons.length; i++) {
            const $row = $(templateRow);
            $row.attr("name", `grid-row${i}`);
            for (let j = 0; j < buttons[i].length; j++)
            {
                const options = {...buttons[i][j], id: id};
                const $room = $(templateItem);
                $room.attr("name", `grid-item${i}-${j}`);
    
                S.Control.ImageButton.addButton($room, options);
                $row.append($room);

                rooms.push(new S.Pages.Room(options));
    
                id++;
            }
            S.Util.findName("grid", $element).append($row);
        }
    }

    let init = function() {
        _initRooms();
    }
    
    init();
    
    S.Routing.view('rooms', null, function () {
        return $element;
    }, '/rooms');

    S.Routing.view("room", null, function(params) {
        return rooms[params.roomNum].getElement();
     }, '/rooms/{roomNum}');  
})();