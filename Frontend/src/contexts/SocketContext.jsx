import { createContext, useContext, useEffect } from "react";
import { io } from 'socket.io-client';
import { captainDataContext } from "./CaptainContext";
import { userDataContext } from "./UserContext";

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

export const socketDataContext = createContext();



function SocketContext({ children }) {
    const {user}=useContext(userDataContext);
const {captain}=useContext(captainDataContext);

    console.log("socket-context");
    
        socket.on('connect', () => {
            console.log('Connected to server');
            console.log('user: ',user);
            console.log('captain: ',captain);
            if(Object.keys(user).length!=0){
                console.log('user');
                socket.emit('join',{ userType: 'user', user });

            }else if(Object.keys(captain).length!=0){
                console.log('captain');
                socket.emit('join',{ userType: 'captain', user: captain });
            }
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        })
    



    const sendMessage = (eventName, message) => {
        console.log(`Sending message: ${message} to ${eventName}`);
        socket.emit(eventName, message);
    }

    const receiveMessage = (eventName, message) => {
        console.log(`Received message: ${message} from ${eventName}`);
        socket.on(eventName, message);
    }

    return (
        <socketDataContext.Provider value={{ socket, sendMessage, receiveMessage }}>
            {children}
        </socketDataContext.Provider>
    )
}

export default SocketContext;