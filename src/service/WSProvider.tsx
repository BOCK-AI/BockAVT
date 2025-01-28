import { tokenStorage } from "@/store/storage";
import React, { createContext, useEffect, useRef, useState } from "react";
import {io, Socket} from 'socket.io-client';
import { SOCKET_URL } from "./config";
import { refresh_tokens } from "./apiInterceptors";

interface WSService {
    initialize: () => void;
    emit: (event: string, data?: any) => void;
    on: (event: string,cb: (data?: any) => void) => void;
    off: (event: string, data?: any) => void;
    removeListeners: (listenerName: string) => void;
    updateAccessToken: () => void;
    disconnect: () => void;
}

const WSContext = createContext<WSService | null>(null);

export const WSProvider: React.FC <{Children: React.ReactNode}> = ({Children}) => {
    
    const  [socketAccessToken, setSocketAccessToken] = useState<string | null>(null);
    const socket = useRef<Socket>();
    
    useEffect(() => {
        const token = tokenStorage.getString('access_token') as any;
        setSocketAccessToken(token);
    }, []);

    useEffect(() => {
        if(socketAccessToken){
            if(socket.current){
                socket.current.disconnect();
            }

            socket.current = io(SOCKET_URL, {
                transports: ['websocket'],
                withCredentials: true,
                extraHeaders: {
                    access_token: socketAccessToken || ""
                }
            })

            socket.current.on('connect_error', (error) => {
                if(error.message === 'Authentication error'){
                    console.log('Authentication error', error.message);
                    refresh_tokens();    
                }
            })

        }

        return () => {
            socket.current?.disconnect();
        }
    }
    , [socketAccessToken]);

    const emit = (event: string, data: any) => {
        socket.current?.emit(event, data);
    }

    const on = (event: string, cb: (data: any) => void) => {
        socket.current?.on(event, cb);
    }

    const off = (event: string) => {
        socket.current?.off(event);
    }   

    const removeListeners = (listenerName: string) => {
        socket.current?.removeAllListeners(listenerName);
    }

    const disconnect = () => {
        if(socket.current){
            socket.current.disconnect();
            socket.current = undefined;
        }
    }

    const updateAccessToken = () => {
        const token = tokenStorage.getString('access_token') as any;
        setSocketAccessToken(token);
    }

    const socketService: WSService = {
        initialize: () => {},
        emit,
        on,
        off,
        removeListeners,
        updateAccessToken,
        disconnect
    }

    return (
        <WSContext.Provider value={socketService}>
            {Children}
        </WSContext.Provider>
    )
}

export const useWS = () => {
    const context = React.useContext(WSContext);
    if(!context){
        throw new Error('useWS must be used within a WSProvider');
    }
    return context;
}