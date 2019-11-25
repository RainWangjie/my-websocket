/**
 * websocket二次封装，隔离多个ws链接，处理指定消息
 *
 * @class myWebSocket
 */
declare type MessageFunc = (data: any, time: Date) => void;
interface IWsOpt {
    protocol?: 'ws' | 'wss';
    host?: string;
    url: string;
    isOpen?: boolean;
    reconnectNum?: number;
    preFunc?: () => void;
}
declare class MyWebSocket {
    ws: WebSocket;
    constructor(opt?: IWsOpt);
    private opt;
    private status;
    private name;
    private reconnectNum;
    private timer;
    private messageList;
    private registerList;
    private unSentList;
    open: () => Promise<void>;
    send(type: string, data?: any, extend?: {}): void;
    message(type: string, func: MessageFunc): void;
    register(type: string, data: any, extend?: {}): void;
    removeMessage: (messages: string | string[]) => void;
    removeMessageFunc: (message: string, func: MessageFunc) => void;
    removeRegister(registers: string | string[]): void;
    close(): void;
    console(type: string, timestamp: string, data: any): void;
    private init;
    private onOpen;
    private reconnect;
    private dealMessage;
    private dealUint8Array;
}
export default MyWebSocket;
