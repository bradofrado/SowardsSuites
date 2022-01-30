S.Rooms = (function () {
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
            {name: "Room 1", path: "/rooms/1", img: "/images/room1.jpg"},
            {name: "Room 2", path: "/rooms/2", img: "/images/room2.jpg"},
            {name: "Room 3", path: "/rooms/3", img: "/images/room3.jpg"}
        ],
        [
            {name: "Room 4", path: "/rooms/4", img: "/images/room4.jpg"}
        ],
    ]

    let _template = $(templatePage);

    let init = function() {
        let id = 0;
        for (let i = 0; i < buttons.length; i++) {
            const _row = $(templateRow);
            _row.attr("name", `grid-row${i}`);

            for (let j = 0; j < buttons[i].length; j++)
            {
                const options = {...buttons[i][j], id: id};
                const _item = $(templateItem);
                _item.attr("name", `grid-item${i}-${j}`);

                S.ImageButton.addButton(_item, options);
                _row.append(_item);

                id++;
            }
            S.Util.findName("grid", _template).append(_row);
        }
    }

    init();

    S.Routing.view('rooms', null, function () {
        return _template;
    }, '/rooms')
})();