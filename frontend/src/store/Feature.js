import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { io } from 'socket.io-client'
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

const SERVER_URL = "http://localhost:5000/api"
const SOCKET_URL = "http://localhost:5000"

const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true
})

const useFeatures = create(persist((set, get) => ({

    roomId: null,
    roomUsers: [],
    drawingData: [],
    isCreatingRoom: false,
    isJoiningRoom: false,
    isGettingRoomInfo: false,
    roomJoin: false,
    username: null,
    userId: null,
    onlineUsers: [],
    newSocket: null,

    setRoomJoin: (value) => set({ roomJoin: value }),


    createAndJoinRoom: async (body) => {
        if (body.creating) {
            set({ isCreatingRoom: true })
        } else {
            set({ isJoiningRoom: true })
        }
        try {
            const res = await axiosInstance.post("/rooms/join", body)
            set({ roomId: res.data.room.roomId })
            get().joinRoom()
            toast.success(res.data.message)
            console.log(get().roomId)
        } catch (error) {
            set({ isJoiningRoom: false })
            set({ isCreatingRoom: false })
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    },

    gettingRoomInfo: async (roomId) => {
        set({ isGettingRoomInfo: true })
        try {
            const res = await axiosInstance.get(`/rooms/:${roomId}`)
            console.log(res.data)

        } catch (error) {
            set({ isGettingRoomInfo: false })
            console.log(error?.message)
        }
    },

    connectSocket: () => {
        const { userId } = get();
        if (!userId) return;

        // Disconnect old socket
        if (get().newSocket?.connected) get().newSocket.disconnect();

        // Create new socket (in-memory only)
        const socket = io(SOCKET_URL, {
            query: { userId },

        });

        // Store in memory (do NOT persist)
        set({ newSocket: socket });

        // Listeners
        socket.on('getOnlineUsers', (online) => {
            console.log("all online users count", online);
            set({ onlineUsers: online });
        });

        socket.on("roomUsers", (users) => {
            console.log("Users in room:", users);
            set({ roomUsers: users });
        });
    },

    joinRoom: () => {
        const { newSocket, roomId } = get();
        if (!newSocket || !roomId) return;

        // Emit join-room event
        newSocket.emit("join-room", roomId);
    },

    leaveRoom: () => {
        const { newSocket, roomId } = get();
        if (!newSocket || !roomId) return;

        newSocket.emit("leave-room", roomId); // tell server you are leaving

        // Clear local room data
        set({ roomId: null, roomUsers: [] });
    },


    // disconnectSocket: () => {
    //     if (get().socket?.connected) {
    //         get().socket.disconnect()
    //     }
    // },

    initUser: () => {
        const { username, userId } = get();
        if (!username || !userId) {
            const newUsername = `User_${Math.floor(Math.random() * 1000)}`;
            const newUserId = nanoid();
            set({ username: newUsername, userId: newUserId });
        }
    },

    setUsername: (name) => set({ username: name }),

}),
    {
        name: "user-storage", // persists only serializable parts
        partialize: (state) => ({
            username: state.username,
            userId: state.userId,
        }),
    }
))

export default useFeatures