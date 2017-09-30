
import {User} from "./user";

export class NotificationBean {
    public _id : string ;
    public type : string;
    public publId  : string;
    public profiles : Array <User>= [];
    public isSeen : boolean;
    public date_notification: string;
    public profileId : string;
    
}