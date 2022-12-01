export const CONNECTION = 'connection';

// EMITTER FOR client to server
//Common Events
export const EMIT_DISCONNECT = 'disconnect';
export const EMIT_JOIN = 'join';
export const EMIT_LEAVE_ROOM = "leaveRoom";
export const EMIT_JOIN_ROOM = "joinRoom";
export const EMIT_LIKE_UNLIKE = 'likeUnlike';
export const EMIT_SET_CHAT_BACKGROUND = 'setBackgroundColor'

// PERSONAL Messages Events

export const EMIT_SEND_PERSONAL_MESSAGE = 'sendMessage';
export const EMIT_JOIN_PERSONAL_ROOM = 'joinOneToOneRoom';
export const EMIT_READ_MESSAGE = 'readMessages';

/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/

//LISTENER from server to client



//Common Events
export const ON_CONNECTION = 'onConnection';
export const ON_DISCONNECT = 'disconnect';
export const ON_RECONNECT = 'reconnect';
export const ON_CONNECT = 'connect';
export const ON_JOIN = 'onJoin';
export const ON_LEAVE_ROOM = "onLeaveRoom";
export const ON_JOIN_ROOM = "onJoinRoom";
export const ON_LIKE_UNLIKE = "onLikeUnlike";//When Message Is  Like/Un-liked
export const ON_SET_CHAT_BACKGROUND = 'onSetBackgroundColor'

// PERSONAL Messages Events
export const ON_PERSONAL_MESSAGE = 'onMessage';
export const ON_READ_MESSAGE = 'onReadMessages'
export const ON_PERSONAL_JOIN_ROOM_REQUEST = 'onJoinOneToOneRoom';