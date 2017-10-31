import { Input, Output, EventEmitter, Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Comment } from '../comment/comment';
import { LoadingBar } from '../loading/loading-bar';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/* conf */
import { AppSettings } from '../conf/app-settings';

/* services */
import { LoginService } from '../service/loginService';
import { DateService } from '../service/dateService';
import { EmojiService } from "../service/emojiService";
import { LinkView } from "../service/linkView";
import { PostService } from "../service/postService";
import { SeoService } from '../service/seo-service';


/* beans */
import { PublicationBean } from '../beans/publication-bean';
import { DiffDateBean } from '../beans/diff-date-bean';
import { CommentBean } from '../beans/comment-bean';

/* beans  */
import { User } from '../beans/user';
import { EmojiListBean } from "../beans/emoji-list-bean";
import { LinkBean } from '../beans/linkBean';

import { timer } from "rxjs/observable/timer";
import {environment} from "../../environments/environment";

declare var jQuery: any;
declare var swal: any;

@Component({
  moduleId: module.id,
	selector: 'publication',
	inputs: ['publicationBean'],
	templateUrl: 'publication.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Publication {
	private isFixedPublishDate: boolean = false;
	private fixedPublishDate: string;
	private publicationBean: PublicationBean;
	private afficheCommentsLoading = false;
	private afficheMoreComments = false;
	public signalButton = false;
	private listComments: Array<CommentBean> = [];
	private nbMaxAddComments = 3;
	private nbComments = 0;
	private nbDisplayedComments = 0;
	public user: User = new User();
	public dateDisplay = "";
	public listLink: Array<string> = [];
	formComment;
	formCommentV2;
	selectedEmojiTab = 0;
	emojiOpacity = 0;
	emojiToggleActive = false;
	commentInputText = "";
	commentText = "";
	public modalPub = false;
	public pubLink = "";
	public shareLink = "";
	signalSubMenu = false;
	linkYtb = "";
	url: SafeResourceUrl;
	listEmoji: Array<EmojiListBean> = [];
	newCommentText: string = "";
	uploadedPictureComment: File;
	likeAnimation = false;
	pubImgId;
	loadingComment = false;
	commentsDisplayed = false;
	emojiHoverId = "";
	commentTextareaId = "";
	public link: LinkBean = new LinkBean();

	imageBaseUrl = environment.IMAGE_BASE_URL;

	constructor(public seoService: SeoService, private postService: PostService, private linkView: LinkView, private emojiService: EmojiService, private http: Http, private router: Router, private sanitizer: DomSanitizer, private loginService: LoginService, private changeDetector: ChangeDetectorRef, private dateService: DateService) {
		loginService.actualize();

		this.user = loginService.user;
		this.listEmoji = emojiService.getEmojiList();
		this.pubImgId = "imgDefault";//+this.publicationBean._id;
		this.formComment = new FormGroup({
			pubComment: new FormControl('', Validators.required),
			commentText: new FormControl('', Validators.required)
		});

	}

	deletePub() {
		swal({
			title: "Êtes-vous sûr?",
			text: "Vous ne serez pas en mesure de récupérer cette publication!",
			showCancelButton: true,
			cancelButtonColor: '#999',
			confirmButtonColor: "#6bac6f",
			confirmButtonText: "Oui, supprimez-le!",
			allowOutsideClick: true,
		}).then(function () {
			this.doDeletePub("sU");
			this.closeModalPub();
			swal({
				title: "supprimé !",
				text: "Votre publication a été supprimé.",
				type: "success",
				timer: 1000,
				showConfirmButton: false
			}).then(function () { }, function (dismiss) { });
			this.changeDetector.markForCheck();

		}.bind(this),
			function (dismiss) {
				if (dismiss === 'overlay') {}
			});
	}

	MaskPub() {
		swal({
			title: "Êtes-vous sûr?",
			text: "Vous pouvez masquer cette publication ? ",
			showCancelButton: true,
			cancelButtonColor: '#999',
			confirmButtonColor: "#6bac6f",
			confirmButtonText: "Oui, masquer-le!",
			allowOutsideClick: true
		}).then(function () {
			this.doMaskPub();
			this.closeModalPub();
			swal({
				title: "Masqué !",
				text: "Votre publication a été masqué.",
				type: "success",
				timer: 1000,
				showConfirmButton: false
			}).then(function () { }, function (dismiss) { });
			this.changeDetector.markForCheck();
		}.bind(this),
			function (dismiss) {
				if (dismiss === 'overlay') {}
			});
	}

	doMaskPub() {
		this.changeDetector.markForCheck();
		let body = JSON.stringify({
			publId: this.publicationBean._id,
			userID:this.user._id
		});
		this.http.post(environment.SERVER_URL + 'masquerPublicationAdmin', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				this.publicationBean.confidentiality="PRIVATE";
				console.log(response);
				this.changeDetector.markForCheck();
			},
			err => { },
			() => {
				this.changeDetector.markForCheck();
			}
			);
	}

	doDeletePub(text) {
		this.publicationBean.displayed = false;
		this.changeDetector.markForCheck();
		var body;
		if(text="sU") {
			 body = JSON.stringify({
			publId: this.publicationBean._id,
		});

			 this.http.post(environment.SERVER_URL + 'removePublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				this.changeDetector.markForCheck();
			},
			err => { },
			() => {
				this.changeDetector.markForCheck();
			}
			);

		}
		else {
			 body = JSON.stringify({
			publId: this.publicationBean._id,
			raisonDelete:text
		});

			 this.http.post(environment.SERVER_URL + 'removePublicationAdmin', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				this.changeDetector.markForCheck();
			},
			err => { },
			() => {
				this.changeDetector.markForCheck();
			}
			);
		}
	}

	displayComments() {
		if (this.commentsDisplayed)
			return;
		else {
			this.commentsDisplayed = true;
		}
		if (this.publicationBean.comments.length > this.nbMaxAddComments) {
			this.afficheMoreComments = true;
			this.nbComments = this.nbMaxAddComments;
			for (let i = 0; i < this.nbComments; i++)
				this.listComments.push(this.publicationBean.comments[i]);
		}
		else {
			this.nbComments = this.publicationBean.comments.length;
			for (let i = 0; i < this.nbComments; i++)
				this.listComments.push(this.publicationBean.comments[i]);
		}
	}


	ngOnInit() {
		this.changeDetector.markForCheck();
		if (this.publicationBean.publExternalLink) {
			this.linkAPI();
		}
		this.emojiHoverId = "emoji-hover-" + this.publicationBean._id;
		this.pubImgId = "img" + this.publicationBean._id;
		this.commentTextareaId = "comment-" + this.publicationBean._id;
		this.changeDetector.markForCheck();
		if (this.publicationBean) {

			this.pubLink = urlEncode(environment.SERVER_URL + "main/post/" + this.publicationBean._id);
			this.shareLink = "https://www.facebook.com/sharer/sharer.php?u=" + this.pubLink + "&amp;src=sdkpreparse";

			this.nbDisplayedComments = this.publicationBean.comments.length;

			//Youtube Loading
			if (this.publicationBean.publyoutubeLink) {
        this.linkYtb = "https://www.youtube.com/embed/" + this.publicationBean.publyoutubeLink;
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkYtb);
			}
			else {
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl('');
			}
			jQuery(document).click(function (e) {

				if (jQuery(e.target).closest(".sub-menu").length === 0 && jQuery(e.target).closest(".dots").length === 0) {
					closeSignal();
				}
				if (jQuery(e.target).closest(".emoji-hover").length === 0 && jQuery(e.target).closest(".toggleEmoji").length === 0) {
					// this.emojiToggleActive = false;
					closeEmoji();
				}
			});
			jQuery(".textarea").keydown(function (e) {
				if (e.keyCode == 13 && !e.shiftKey) {
					e.preventDefault();
				}

			});

		}
		var publishCommentWithEnter = function () {
			alert(this.publicationBean._id);
		}.bind(this)
		var loadChanges = function () {
			this.changeDetector.markForCheck();
		}.bind(this);


		var closeEmoji = function () {
			jQuery("#" + this.emojiHoverId).hide();
			this.changeDetector.markForCheck();
		}.bind(this);
		var closeSignal = function () {
			this.signalButton = false;
			this.changeDetector.markForCheck();
		}.bind(this);
	}

	checkEnter(event) {
		console.log(event, event.keyCode, event.keyIdentifier);
	}

	publishCommentV2() {
		if (!this.commentInputText && !this.uploadedPictureComment) {
			return;
		}
		this.loadingComment = true;
		this.changeDetector.markForCheck();
		var data = new FormData();

		data.append('commentText', this.commentInputText);
		data.append('profileId', this.user._id);
		data.append('publId', this.publicationBean._id);
		data.append('commentPicture', this.uploadedPictureComment);
		this.changeDetector.markForCheck();

		this.http.post(environment.SERVER_URL + 'addComment', data, AppSettings.OPTIONS_POST)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				this.changeDetector.markForCheck();
				if (response.status == "1") {
					if (response.comment) {
						if (!this.publicationBean.comments.length)
							this.publicationBean.comments.unshift(response.comment);

						this.listComments.unshift(response.comment);
						this.nbDisplayedComments++;
						//this.formComment.controls.pubComment.updateValue('');
						this.changeDetector.markForCheck();
						this.commentInputText = "";
						jQuery("#" + this.commentTextareaId).empty();
						jQuery("#" + this.pubImgId).attr('src', "");
						jQuery("#" + this.pubImgId).hide();
						this.uploadedPictureComment = null;
						this.loadingComment = false;
					}

				}
				else {
					console.error(response);
					this.loadingComment = false;

				}
			},
			err => { },
			() => {
			}
			);

	}
	//uploading Photo click event
	addPhoto() {
		jQuery(("." + this.pubImgId)).click();
	}
	//uploading photo or GIF
	uploadPhoto($event) {
		var inputValue = $event.target;
		if (inputValue != null && null != inputValue.files[0]) {
			this.uploadedPictureComment = inputValue.files[0];
			previewFile(this.uploadedPictureComment, this.pubImgId);

		}
		else {
			this.uploadedPictureComment = null;
		}
	}
	resetCommentPicture() {
		jQuery("#" + this.pubImgId).attr('src', "");
		jQuery("#" + this.pubImgId).hide();
		this.uploadedPictureComment = null;
	}

	sharePub(post: PublicationBean) {
		swal({
			title: "Êtes-vous sûr?",
			text: "voulez-vous partager cette publication ? ",
			showCancelButton: true,
			confirmButtonColor: "#6bac6f",
			confirmButtonText: "oui",
			cancelButtonText: "non",
			cancelButtonColor: '#999',
			allowOutsideClick: true
		}).then(function () {
			swal({
				title: "paratgé !",
				text: "Votre publication a été partagé.",
				type: "success",
				timer: 1000,
				showConfirmButton: false
			}).then(function () { }, function (dismiss) { });
			this.doSharePub(post);
		}.bind(this),
			function (dismiss) {
				// dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
				if (dismiss === 'overlay') {

				}
			}
			);
	}
	doSharePub(post) {
		var pubId;
		if (post.isShared) {
			pubId = post.originalPublicationId;
		}
		else {
			pubId = this.publicationBean._id;
		}
		let body = JSON.stringify({
			publId: pubId,
			profileId: this.user._id
		});
		this.http.post(environment.SERVER_URL + 'sharePublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				if (response) {
					if (response.status) {
						var element: PublicationBean = response.publication;
						this.postService.putNewPub(element, true);
						this.changeDetector.markForCheck();
					}
				}
			},
			err => { },
			() => {

			}
			);
	}
	reportPub(post: PublicationBean) {
		//alert("you wana report this post ? : "+post.publText+" with id : "+post._id);


		swal({
			title: "Signaler cette publication",
			text: "Que se passe-t-il ?",
			showCancelButton: true,
			cancelButtonColor: '#999',
			confirmButtonColor: "#6bac6f",
			confirmButtonText: "confirmer",
			input: 'textarea',
		}).then(function (text) {
			if(text){
				this.doReportPub(text);
				swal({
					title: "Signalé !",
					text: "Cette publication a été Signalé.",
					type: "success",
					timer: 1000,
					showConfirmButton: false
				}).then(function () { }, function (dismiss) { });
			this.changeDetector.markForCheck();
			}

		}.bind(this),
			function (dismiss) {
				// dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
				if (dismiss === 'overlay') {

				}
			}
		);
		this.closeModalPub();
	}
	doReportPub(text){
		let body = JSON.stringify({
			signalText:text,
			publId: this.publicationBean._id,
			profileId: this.user._id
		});
		this.http.post(environment.SERVER_URL + 'signalerPublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				console.log(response);
			},
			err => { },
			() => {
			}
			);
	}
	modifPub(post: PublicationBean) {
		alert("you wana modify this post ? : " + post.publText + " with id : " + post._id);
		console.log(post);
	}
	loadMoreComments(i: number) {
		this.afficheCommentsLoading = true;
		this.afficheMoreComments = false;
		if (i >= this.nbMaxAddComments) {
			this.afficheCommentsLoading = false;
			this.afficheMoreComments = true;
			this.changeDetector.markForCheck();
		}
		else if ((this.listComments.length) >= this.publicationBean.comments.length) {
			this.afficheCommentsLoading = false;
			this.afficheMoreComments = false;
			this.changeDetector.markForCheck();
		}
		else {
			setTimeout(() => {
				this.listComments.push(this.publicationBean.comments[i + this.nbComments]);
				this.changeDetector.markForCheck();
				this.loadMoreComments(i + 1);
			}, 0);
		}
	}

	public activateSignal() {
		this.signalButton = !this.signalButton;
	}


	getPublicationTime(publishDateString: string): string {
		if (this.isFixedPublishDate)
			return this.fixedPublishDate;
		let date = new Date();
		let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
		let publishDate = this.dateService.convertIsoToDate(publishDateString);

		let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
		if (diffDate.day > 28) {
			this.fixedPublishDate = this.dateService.convertPublishDate(publishDate);
			this.isFixedPublishDate = true;
		}
		else if (diffDate.day && diffDate.day == 1) {
			this.fixedPublishDate = "hier";
			this.isFixedPublishDate = true;
		}
		else if (diffDate.day > 0) {
			this.fixedPublishDate = diffDate.day + " jours";
			this.isFixedPublishDate = true;
		}
		else if ((diffDate.hour) && (diffDate.hour == 1)) {
			this.fixedPublishDate = "1 hr";
			this.isFixedPublishDate = true;
		}
		else if ((diffDate.hour) && (diffDate.hour > 0)) {
			this.fixedPublishDate = diffDate.hour + " hrs";
			this.isFixedPublishDate = true;
		}
		else if ((diffDate.min) && (diffDate.min > 1))
			this.fixedPublishDate = diffDate.min + " mins";
		else
			this.fixedPublishDate = "maintenant";
		return this.fixedPublishDate;
	}

	addOrRemoveLike() {
			if (!this.publicationBean.isLiked)
				this.addLike();
			else
				this.removeLike();
	}

	addLike() {
		if (this.publicationBean.isDisliked)
			this.removeDislike();

		let body = JSON.stringify({
			publId: this.publicationBean._id,
			profileId: this.user._id
		});
		this.http.post(environment.SERVER_URL + 'likePublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {

			},
			err => { },
			() => {
			}
			);

		this.publicationBean.isLiked = true;
		this.publicationBean.nbLikes++;

	}

	removeLike() {
		let body = JSON.stringify({
			publId: this.publicationBean._id,
			profileId: this.user._id
		});
		this.http.post(environment.SERVER_URL + 'removeLikePublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {

			},
			err => { },
			() => {
			}
			);

		this.publicationBean.isLiked = false;
		this.publicationBean.nbLikes--;
	}

	addOrRemoveDislike() {
			if (!this.publicationBean.isDisliked)
				this.addDislike();
			else
				this.removeDislike();
	}

	addDislike() {
		if (this.publicationBean.isLiked)
			this.removeLike();

		let body = JSON.stringify({
			publId: this.publicationBean._id,
			profileId: this.user._id
		});
		this.http.post(environment.SERVER_URL + 'dislikePublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
			},
			err => { },
			() => {

			}
			);

		this.publicationBean.isDisliked = true;
		this.publicationBean.nbDislikes++;
	}
	removeDislike() {
		let body = JSON.stringify({
			publId: this.publicationBean._id,
			profileId: this.user._id
		});
		this.http.post(environment.SERVER_URL + 'removeDislikePublication', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
			},
			err => { },
			() => {

			}
			);
		this.publicationBean.isDisliked = false;
		this.publicationBean.nbDislikes--;
	}
	public toggleEmoji() {
		jQuery("#" + this.emojiHoverId).toggle();
	}
	public closeModalEmoji() {
		jQuery("#" + this.emojiHoverId).hide();
	}
	openModalPub() {
		this.modalPub = true;
	}
	closeModalPub() {
		this.modalPub = false;
	}

	changeEmojiTab(tab) {
		this.selectedEmojiTab = tab;
	}
	addToComment(emoji) {
		if (this.commentInputText[this.commentInputText.length - 1] == " ") {
			this.commentInputText = this.commentInputText + emoji.shortcut + " Hello";
		}
		else {
			this.commentInputText = this.commentInputText + " " + emoji.shortcut + " Hello";
    }
  }
	updateComment($event) {
		this.commentText = $event.path[0].innerHTML;
		this.changeDetector.markForCheck();
	}
	afficheComment(comment): string {
		var img = '<img class="emoji" style="align:absmiddle; top : 0;" src="assets/images/basic/';
		for (var i = 0; i < this.listEmoji.length; i++) {
			for (var j = 0; j < this.listEmoji[i].list.length; j++) {
				comment = this.replaceAll(comment, this.listEmoji[i].list[j].shortcut, img + this.listEmoji[i].list[j].imageName + '.png" />');
			}
		}
		return comment;
	}
	replaceAll(comment, search, replacement) {
		return comment.split(search).join(replacement);
	}
	affichePostText(postText: string): string {
		return this.emojiService.AfficheWithEmoji(postText);
	}
	activateAnimation() {
		this.likeAnimation = true;
	}
	deactivateAnimation() {
		this.likeAnimation = false;
	}
	linkAPI() {

		var linkURL = this.publicationBean.publExternalLink;
		if (linkURL.search(".gif") >= 0) {
                var checker = linkURL.substr(linkURL.length - 8, 8);
                if (checker.indexOf(".gif") >= 0) {
                    this.link.image = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
                    this.link.imageWidth = 500;
                    this.link.imageHeight = 500;
                    this.link.isGif = true;
                    this.link.url = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
                    this.link.title = "gif";
                    this.link.description = "gif";
                    this.link.isSet = true;
                    return 1;
                }
            }

		this.http.get(
      environment.SERVER_URL + 'getOpenGraphData?url=' + linkURL, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
				if (response.results.success) {
					this.link.url = linkURL;
					this.link.title = response.results.data.ogTitle;
					this.link.description = response.results.data.ogDescription;
					if (response.results.data.ogImage) {
						var a = response.results.data.ogImage.url;
                            this.link.image = response.results.data.ogImage.url;
                            this.link.imageWidth = response.results.data.ogImage.width;
                            this.link.imageHeight = response.results.data.ogImage.height;
                            if (a.substring(a.length - 3, a.length) == "gif")
                                this.link.isGif=true;
                            else
                                this.link.isGif=false;
					}
					else {
						this.link.image = null;
						this.link.imageWidth = 0;
						this.link.imageHeight = 0;
					}
					this.link.isSet = true;


					this.changeDetector.markForCheck();
				}
				else {
					console.error("error in link API; " + linkURL);

				}
			},
			err => {
				//error
				console.error("error in link API; " + linkURL);

			},
			() => {
				//final
			}
			);
	}
}


function urlEncode(source: string): string {
	source = replaceAllNew(source, ":", "%3A");
	source = replaceAllNew(source, "/", "%2F");
	source = replaceAllNew(source, "#", "%23");

	return source;
}
function replaceAllNew(comment, search, replacement) {
	return comment.split(search).join(replacement);
}
function previewFile(uploadedFile, elementId) {
	var preview = jQuery('#preview-image');
	var file = uploadedFile;
	var reader = new FileReader();

	reader.addEventListener("load", function () {
		//preview.att.src = reader.result;

		jQuery("#" + elementId).attr('src', reader.result);
		jQuery("#" + elementId).fadeIn(500);
		//console.log(reader.result);
		//test

	}, false);

	if (file) {
		reader.readAsDataURL(file);
	}
}
