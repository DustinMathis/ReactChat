import React from 'react';
import io from 'socket.io-client';

export const CTX= React.createContext();

const initState = {
    General: [
        {from: 'Random User', msg:'Try it out!'}, 
        
        
    ],
    Topic2: [
        {from: 'Random User', msg:'Try topic 2!'}, 
        
        
    ]

}

function reducer(state, action){
    const{from, msg, topic} = action.payload;
    switch(action.type){
        case 'RECEIVE_MESSAGE': 
        return{
            ...state,
            [action.payload.topic]:[
                ...state[topic],
                {from, msg}
                
            ]
        }
        default:
            return state
    }
}


let socket;

function sendChatAction(value){
    socket.emit('chat message', value);

}


export default function Store(props){
    const [allChats, dispatch] = React.useReducer(reducer, initState);
    if (!socket){

        socket = io(process.env.PORT);
        socket.on('chat message', function(msg){
            dispatch({type: 'RECEIVE_MESSAGE' , payload : msg});
        })

    }
    const user = 'User' + Math.floor(Math.random() * 10) + 1;
   

    return(
        <CTX.Provider value={{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}