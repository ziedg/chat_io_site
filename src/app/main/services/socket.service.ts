import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';


@Injectable()
export class SocketService {

	private BASE_URL = environment.SERVER_URL;
	private socket;

	constructor() { }

	/*
	* Method to connect the users to socket
	*/
	connectSocket(userId: string): void {
		this.socket = io(this.BASE_URL, {  query: `userId=${userId}`, transports: ['websocket']  } );
    }

    sendMessage(message){
		this.socket.emit('add-message', message);
        /* here the logic to send a message */
    }

    receiveMessages(): Observable<any> {
		return new Observable(observer => {
			this.socket.on('add-message-response', (data) => {
				observer.next(data);
			});
			return () => {
				this.socket.disconnect();
			};
		});

	}
}
