S.Pages.Rooms = (function (_rooms) {
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

    //TODO:
    //const buttons = options.rooms
    let rooms = [];
    let roomPages = [];
    let $element = $(templatePage);
    const numRoomsPerRow = 3;
    const promise = $.Deferred();

    let _initRooms = function() {
        let id = 0;
        for (let i = 0; i < rooms.length; i) {
            const $row = $(templateRow);
            $row.attr("name", `grid-row${i}`);

            //Loop until a new row or we run out of rooms
            for (let j = 0; j < numRoomsPerRow && i < rooms.length; j++)
            {
                const options = {...rooms[i].props, path: `/rooms/${id}`, id: id, name: null};
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

    let init = async function() {
        rooms = await S.getRooms();
        _initRooms();
        promise.resolve($element);
    }
    
    init();
    
    S.Routing.view('rooms', null, function () {
        return promise.promise();
    }, '/rooms');

    S.Routing.view("room", null, function(params) {
        return promise.promise().then(e => {
            return roomPages[params.roomNum].getElement();
        });
     }, '/rooms/{roomNum}');  
})();