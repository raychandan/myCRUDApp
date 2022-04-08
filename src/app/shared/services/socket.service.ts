import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'; 

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  socketConnection() {
	  return	this.socket.fromEvent('connected');
	}
  
  connectUserToSocket(_id:any) {
	  this.socket.emit('identity', {"userId": _id});
	}
}
