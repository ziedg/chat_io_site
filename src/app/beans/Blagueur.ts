import {User} from './user'

export class Blagueur extends User {

    public position;
	public isSubscribed;
	
	//default 
	constructor() {
		super();
		this.position=0;
		this.isSubscribed=false;
	}

}
