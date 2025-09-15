//just normal stuff
const rooms = [
    {
        room123: [
            { user1: "socket1" },
            { user2: "socket2" },
            { user3: "socket3" }
        ]
    },
    {
        xyz456: [
            { user4: "socket4" }
        ]
    }
];


let roomId = "room123"
const roomObj = rooms.find(r => r[roomId])


console.log(roomObj)


