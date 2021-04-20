declare let io : {
    connect(url: string): Socket;
};
interface Socket {
    on(event: string, callback: (data: any) => void );
    once(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
    connected: boolean;
    disconnected: boolean;
    id: string;
}