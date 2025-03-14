export interface WebSocketMessage {
    type: string;
    data?: any;
}

export interface WebSocketError {
    code: number;
    message: string;
}

export interface WebSocketConnectionInfo {
    token: string;
}

export interface WebSocketPingMessage extends WebSocketMessage {
    type: 'ping';
}

export interface WebSocketPongMessage extends WebSocketMessage {
    type: 'pong';
}

export interface WebSocketPostUpdateMessage extends WebSocketMessage {
    type: 'post_update';
    data: {
        post_id: string;
        action: 'create' | 'update' | 'delete';
    };
}

export interface WebSocketCommentUpdateMessage extends WebSocketMessage {
    type: 'comment_update';
    data: {
        post_id: string;
        comment_id: string;
        action: 'create' | 'update' | 'delete';
    };
}

export interface WebSocketLikeUpdateMessage extends WebSocketMessage {
    type: 'like_update';
    data: {
        post_id: string;
        user_id: string;
        action: 'like' | 'unlike';
    };
}

export type WebSocketEventMessage =
    | WebSocketPingMessage
    | WebSocketPongMessage
    | WebSocketPostUpdateMessage
    | WebSocketCommentUpdateMessage
    | WebSocketLikeUpdateMessage;