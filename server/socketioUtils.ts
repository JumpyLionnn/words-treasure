function getSocket(id: string): undefined | any{
    let socketResult;
    io.sockets.sockets.forEach((socket: any) => {
        if(socket.id === id){
            socketResult = socket;
            return ; 
        } 
    });;
    return socketResult;
}