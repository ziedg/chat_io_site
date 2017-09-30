import {Component} from '@angular/core';
import {CommentBean} from "../beans/comment-bean";

/* comment */
import {Comment} from "../comment/comment";

/* user  */
import {User} from '../beans/user';

@Component({
  moduleId: module.id,
    selector: 'list-comments',
	inputs : ['listComments'],
    templateUrl: 'list-comments.html'
})
export class ListComments {

	listComments: Array<CommentBean> = [];
	user:User = new User();
	constructor(){
		console.log(this.listComments);
	}


}
