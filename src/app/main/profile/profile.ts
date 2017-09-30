import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TopBlagueursAndDecov } from '../../topBlagueursAndDecov/topBlagueursAndDecov';
import Slim from "../../utils/slim.angular2";
import 'rxjs/add/operator/map';


import { Publication } from '../../publication/publication';
import { Comment } from '../../comment/comment';

/* conf */
import { AppSettings } from '../../conf/app-settings';

/* services */
import { LoginService } from '../../service/loginService';
import { LinkView } from "../../service/linkView";
import { LinkPreview } from "../../service/linkPreview";

/* user  */
import { User } from '../../beans/user';

/* beans */
import { PublicationBean } from '../../beans/publication-bean';
import { NotFound } from "../notFound/not-found";
import { Title } from "@angular/platform-browser";
import { LinkBean } from '../../beans/linkBean';



declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var BlobBuilder: any;
declare var FB: any;
declare var auth: any;
declare const gapi: any;

@Component({
    moduleId: module.id,
    selector: 'profile',
    templateUrl: 'profile.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class Profile {
    form;
    uploadedPicture: File;
    uploadedProfilePicture: File;
    isLock: boolean = false;
    finPosts: boolean = false;
    public publicationBeanList: Array<PublicationBean> = [];
    public user: User = new User();
    public userDisplayed: User = new User();
    private wrongProfile: boolean = false;
    public link: LinkBean = new LinkBean();
    public previewLink: Array<LinkBean> = [];

    titleEnable = false;
    youtubeInput = false;
    youtubeLink = "";
    menuFilter = "recent";
    selectedMenuElement = 0;
    loadingPublish = false;
    noPosts: boolean = false;

    showErreurConnexion = false;
    showLoading = false;
    lastPostId: string = "null";
    userParm;
    lastRouterProfileId;
    editModal = false;
    pubText: string;
    publishBox = false;
    publishText: string;
    isSub = false;
    firstListSub: Array<User> = [];
    listAllSub: Array<User> = [];
    showMoreSub = false;
    lastSubscribeId: string = "";
    stopGiveMeMoreSub: boolean = false;
    descEnable = false;
    linkLoading = false;
    isEmpty = true;
    wanaModifPhoto = false;
    slimMeta;
    slimOptions;
    profilePictLoad: boolean = false;

    savePhotoProfile(data, ready) {
        var newImgSrc = data.output.image;
        ready(data);
    }
    modifPhoto() {
        jQuery("#slimPrev").hide();
        this.wanaModifPhoto = true;
    }
    slimDidInit(data) {
        console.log(data);
    };
    constructor(private linkView: LinkView, private linkPreview: LinkPreview, private title: Title, private route: ActivatedRoute, private http: Http, private router: Router, private loginService: LoginService, private changeDetector: ChangeDetectorRef) {
        this.noPosts = false;




        console.log(this.slimMeta);
        console.log(this.slimOptions);
        if (loginService.isConnected()) {
            loginService.actualize();
            this.user = loginService.user;
            this.slimMeta = {
                userId: this.user._id
            }
            this.slimOptions = {
                ratio: '1:1',
                didInit: this.slimDidInit,
                willSave: this.savePhotoProfile,
                label: 'Ajouter photo',
                service: 'http://91.121.69.130:3000/testKhalil',
                meta: this.slimMeta
            };
            this.router.events.subscribe(route => {
                this.changeDetector.markForCheck();
                if (this.route.snapshot.params['id'] != this.lastRouterProfileId) {
                    this.publicationBeanList = [];
                    this.getProfile(this.route.snapshot.params['id']);
                    this.lastRouterProfileId = this.route.snapshot.params['id'];
                }
                window.scrollTo(0, 0);
            });
            this.form = new FormGroup({
                publicationTitle: new FormControl(),
                publicationText: new FormControl('', Validators.required),
                publicationYoutubeLink: new FormControl()
            });
        }
        else {

            if (this.loginService.isWasConnectedWithFacebook()) {
                this.router.navigate(['/login/facebook-login']);
            }
            else if (this.loginService.isWasConnectedWithGoogle()) {
                this.router.navigate(['/login/google-login']);
            }
            else {
                this.router.navigate(['/login/sign-in']);
            }

        }
    }


    changeImage() {


    }
    uploadedPhoto(error, data, response) {

    }
    goFB() {
        if (this.userDisplayed.facebookLink)
            location.href = this.userDisplayed.facebookLink;
    }
    goTW() {
        if (this.userDisplayed.twitterLink)
            location.href = this.userDisplayed.twitterLink;
    }
    goYT() {
        if (this.userDisplayed.youtubeLink)
            location.href = this.userDisplayed.youtubeLink;
    }
    doSubUser(userDisplayed: User) {
        let body = JSON.stringify({
            UserId: this.user._id,//user._id
            profileId: userDisplayed._id
        });


        this.http.post(AppSettings.SERVER_URL + 'subscribe', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {

                userDisplayed.isSubscribe = true;
                userDisplayed.nbSuivi++;
            },
            err => { },
            () => {
                this.changeDetector.markForCheck();
            }
            );

    }
    doNotSubUser(userDisplayed: User) {
        let body = JSON.stringify({
            UserId: this.user._id,//user._id
            profileId: userDisplayed._id
        });

        this.http.post(AppSettings.SERVER_URL + 'removeSubscribe', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                userDisplayed.isSubscribe = false;
                userDisplayed.nbSuivi--;
            },
            err => { },
            () => {
                this.changeDetector.markForCheck();
            }
            );

    }

    doSub() {
        let body = JSON.stringify({
            UserId: this.user._id,//user._id
            profileId: this.userDisplayed._id
        });


        this.http.post(AppSettings.SERVER_URL + 'subscribe', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                this.isSub = true;
                this.changeDetector.markForCheck();

            },
            err => { },
            () => {
                this.changeDetector.markForCheck();
            }
            );
    }
    doNotSub() {
        let body = JSON.stringify({
            UserId: this.user._id,//user._id
            profileId: this.userDisplayed._id
        });

        this.http.post(AppSettings.SERVER_URL + 'removeSubscribe', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                this.isSub = false;
                this.changeDetector.markForCheck();

            },
            err => { },
            () => {
                this.changeDetector.markForCheck();
            }
            );

    }
    getFirstListAllSub() {
        if (this.userDisplayed && this.user) {
            this.http.get(
                AppSettings.SERVER_URL + 'getSubscribers?profileId=' + this.userDisplayed._id + '&lastSubscribeId=' + '&connectedProfileID=' + this.user._id, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {

                    this.listAllSub = [];
                    if (response) {
                        for (var i = 0; i < response.length; i++) {
                            var element: User = response[i];
                            if (response[i].isSubscribe == "true") {
                                element.isSubscribe = true;
                            }
                            else {
                                element.isSubscribe = false;
                            }
                            this.listAllSub.push(element);
                            this.lastSubscribeId = response[i]._id;
                        }
                        if (response.length)
                            this.lastSubscribeId = response[response.length - 1]._id;
                        this.changeDetector.markForCheck();
                    }
                },
                err => {
                },
                () => {
                });
        }

    }
    getMoreListAllSub() {
        if (this.userDisplayed && this.user) {

            this.http.get(
                AppSettings.SERVER_URL + 'getSubscribers?profileId=' + this.userDisplayed._id + '&lastSubscribeId=' + this.lastSubscribeId + '&connectedProfileID=' + this.user._id, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response) {
                        for (var i = 0; i < response.length; i++) {
                            var element: User = response[i];
                            if (response[i].isSubscribe == "true") {
                                element.isSubscribe = true;
                            }
                            else {
                                element.isSubscribe = false;
                            }
                            this.listAllSub.push(element);
                            this.lastSubscribeId = response[i]._id;
                        }
                        if (!response.length) {
                            this.stopGiveMeMoreSub = true;
                        }
                        else {
                            this.stopGiveMeMoreSub = false;
                        }
                    }

                    this.changeDetector.markForCheck();
                },
                err => {
                },
                () => {
                });
        }
    }
    getFirstListSub() {
        if (this.userDisplayed && this.user) {
            this.http.get(
                AppSettings.SERVER_URL + 'getSubscribers?profileId=' + this.userDisplayed._id + '&lastSubscribeId=' + '&connectedProfileID=' + this.user._id, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {

                    this.firstListSub = [];
                    if (response) {
                        for (var i = 0; i < 3 && i < response.length; i++) {
                            var element: User = response[i];

                            if (response[i].isSubscribe == "true") {
                                element.isSubscribe = true;
                            }
                            else {
                                element.isSubscribe = false;
                            }
                            this.firstListSub.push(element);
                        }
                        if (response.length > 3) {
                            this.showMoreSub = true;
                        }
                        else {
                            this.showMoreSub = false;
                        }
                    }

                    this.changeDetector.markForCheck();
                },
                err => {
                },
                () => {
                }

                );
        }
    }
    onScrollSub() {
        this.getMoreListAllSub();
    }

    getProfile(userId: string) {
        if (this.user) {
            this.http.get(
                AppSettings.SERVER_URL + 'getProfileById/?ProfileId=' + userId + '&connectedProfileId=' + this.user._id, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response._id) {
                        if (response._id == userId) {
                            if (response.isSubscribe == "true") {
                                this.isSub = true;
                            }
                            else {
                                this.isSub = false;
                            }
                            this.userDisplayed = response;
                            this.wrongProfile = false;
                            this.title.setTitle(response.firstName + " " + response.lastName);
                            this.loadFirstPosts();
                            this.getFirstListSub();
                            this.getFirstListAllSub();
                            this.changeDetector.markForCheck();
                        }
                        else {
                            this.wrongProfile = true;
                            this.changeDetector.markForCheck();
                        }
                    }
                    else {
                        this.wrongProfile = true;
                        this.changeDetector.markForCheck();
                    }

                    this.changeDetector.markForCheck();
                },
                err => {
                    setTimeout(() => {
                        this.showErreurConnexion = true;
                        this.showLoading = false;
                    }, 3000);
                },
                () => {
                    this.changeDetector.markForCheck();
                }
                );
        }

    }
    putIntoList(response) {
        this.isLock = true;

        var element;
        if (response) {
            for (var i = 0; i < response.length; i++) {
                element = response[i];
                element.displayed = true;

                if (response[i].isShared == "true") {
                    element.isShared = true;
                }
                else {
                    element.isShared = false;
                }

                if (response[i].isLiked == "true")
                    element.isLiked = true;
                else
                    element.isLiked = false;


                if (response[i].isDisliked == "true")
                    element.isDisliked = true;
                else
                    element.isDisliked = false;


                if (response[i].comments) {
                    for (var j = 0; j < response[i].comments.length; j++) {
                        if (response[i].comments[j].isLiked == "true")
                            element.comments[j].isLiked = true;
                        else
                            element.comments[j].isLiked = false;

                        if (response[i].comments[j].isDisliked == "true")
                            element.comments[j].isDisliked = true;
                        else
                            element.comments[j].isDisliked = false;

                        if (j == response[i].comments.length) {
                            this.publicationBeanList.push(response[i]);

                            if (i == response.length - 1) {
                                this.showLoading = false;
                                this.isLock = false;
                                this.lastPostId = response[i]._id;
                            }
                        }
                    }

                }


                this.changeDetector.markForCheck();

                this.publicationBeanList.push(element);
                this.changeDetector.markForCheck();
                if (i == response.length - 1) {
                    this.showLoading = false;
                    this.isLock = false;
                    this.lastPostId = response[i]._id;
                }

            }
        }
    }

    checkPreviewLink($event) {
        this.pubText = jQuery("#pubText").val();
        this.changeDetector.markForCheck();
        this.linkView.getListLinks(this.pubText);
    }
    //load first Post
    loadFirstPosts() {
        if (this.userDisplayed) {
            this.http.get(
                AppSettings.SERVER_URL + 'getPublicationsForOneProfileByID/?ProfileId=' + this.userDisplayed._id + '&last_publication_id=', AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(

                response => {
                    this.changeDetector.markForCheck();

                    if (response.publication) {
                        if (!response.publication.length) {
                            this.noPosts = true;
                        }
                        else {
                            this.putIntoList(response.publication);
                            this.noPosts = false;
                        }
                    }
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.changeDetector.markForCheck();
                    setTimeout(() => {
                        this.showErreurConnexion = true;
                        this.showLoading = false;
                    }, 3000);
                },
                () => {
                    this.isLock = false;
                }

                );
        }


    }

    //load more Posts
    loadMorePosts() {
        if (this.userDisplayed) {
            this.http.get(
                AppSettings.SERVER_URL + 'getPublicationsForOneProfileByID/?ProfileId=' + this.userDisplayed._id + '&last_publication_id=' + this.lastPostId, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response.publication) {
                        if (response.publication.length == 0) {
                            this.finPosts = true;
                        }
                        else {
                            this.changeDetector.markForCheck();
                            this.putIntoList(response.publication);
                            this.isLock = false;
                        }
                    }
                    else {
                        this.finPosts = true;
                    }


                },
                err => {
                    setTimeout(() => {
                        this.showErreurConnexion = true;
                        this.showLoading = false;
                    }, 3000);
                },
                () => {
                    this.isLock = false;
                }
                );
        }


    }

    onScrollDown() {
        if (this.finPosts || this.noPosts) {
            this.showLoading = false;
            this.isLock = true;
            return 0;
        }
        else if (this.isLock) {
            this.showLoading = true;
            return 0;
        }
        else {
            if (this.userDisplayed._id == "")
                this.getProfile(this.route.snapshot.params['id']);
            this.isLock = true;
            this.showLoading = true;
            this.loadMorePosts();
            return 1;
        }
    }
    reLoadposts() {
        this.showLoading = true;
        this.showErreurConnexion = false;
        if (this.publicationBeanList) {
            if (this.publicationBeanList.length == 0)
                this.getProfile(this.route.snapshot.params['id']);
            else
                this.loadMorePosts();
        }

    }
    modifProfilePic() {

    }

    openModal() {
        jQuery(".modal-edit-profile").fadeIn(500);
    }
    closeModal() {
        jQuery(".modal-edit-profile").fadeOut(300);
    }
    openModalFriends() {
        jQuery(".modal-friends").fadeIn(500);
    }
    closeModalFriends() {
        jQuery(".modal-friends").fadeOut(300);
    }
    ngOnInit() {
        jQuery(document).click(function (e) {



            if (jQuery(e.target).closest(".white-box-edit").length === 0 && jQuery(e.target).closest(".profile-edit").length === 0) {
                jQuery(".modal-edit-profile").fadeOut(300);

            }
            if (jQuery(e.target).closest(".white-box-friends").length === 0 && jQuery(e.target).closest(".more-friends").length === 0 && jQuery(e.target).closest(".more-friends-mobile").length === 0) {
                jQuery(".modal-friends").fadeOut(300);

            }



        });

        jQuery(document).click(function (e) {

            if (jQuery(e.target).closest(".select-menu").length === 0 && jQuery(e.target).closest(".dropdown").length === 0) {
                jQuery(".select-menu").hide();
            }
        });
    }
    updatePublishTextOnPaste($event) {
        $event.preventDefault();
        var text = $event.clipboardData.getData("text/plain");
        if (text.search("youtube.com/watch") >= 0) {
            this.youtubeInput = true;
            this.changeDetector.markForCheck();
            jQuery(".yt-in-url").val(text);
            this.changeDetector.markForCheck();
            this.youtubeLink = text;
            this.updateYoutube();
            this.closeLinkAPI();
            return 1;
        }
        if (this.isEmpty) {
            jQuery(".textarea-publish")[0].innerHTML = jQuery(".textarea-publish")[0].innerHTML + "&nbsp;";
            this.publishText = jQuery(".textarea-publish")[0].innerHTML;
        }
        this.linkAPI();
        document.execCommand("insertHTML", false, text);

    }
    updatePublishText($event) {
        this.publishText = $event.path[0].innerHTML;
        if (!this.publishText || this.publishText.length == 0) {
            this.isEmpty = true;
        }
        else {
            this.isEmpty = false;
        }

        //this.link = this.link.update(this.publishText);
        this.linkAPI();
        this.changeDetector.markForCheck();
        //this.linkPreview.linkAPI(this.publishText,this.link ,this.previewLink);
        //this.link = this.linkPreview.returnerLink;
        this.changeDetector.markForCheck();
    }
    closeLinkAPI() {
        this.link.initialise();
    }
    linkAPI() {
        //var linkURL = this.publishText;
        //var linkURL = this.publishText.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);
        {
            var source = (this.publishText || '').toString();
            var myArray = this.linkView.getListLinks(source);
            if (!myArray.length) {
                return 1;
            }
            var linkURL = myArray[0];
            if (linkURL == this.link.url) {
                return 1;
            }
            if (linkURL.search("youtube.com/watch") >= 0) {
                jQuery(".yt-in-url").val(linkURL);
                this.updateYoutube();
                return 1;
            }
            if (linkURL.search(".gif") >= 0) {
                var checker = linkURL.substr(linkURL.length - 13, 8);
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
            this.linkLoading = true;
            this.http.get(
                AppSettings.SERVER_URL + 'getOpenGraphData?url=' + linkURL, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response.results.success) {
                        this.resetPublishPicture();
                        jQuery(".youtube-preview").html("");
                        //this.form.controls.publicationYoutubeLink.updateValue('');
                        this.link.url = linkURL.substring(0, linkURL.length - 6);
                        this.link.title = response.results.data.ogTitle;
                        this.link.description = response.results.data.ogDescription;
                        if (response.results.data.ogImage) {
                            var a = response.results.data.ogImage.url;
                            this.link.image = response.results.data.ogImage.url;
                            this.link.imageWidth = response.results.data.ogImage.width;
                            this.link.imageHeight = response.results.data.ogImage.height;
                            if (a.substring(a.length - 3, a.length) == "gif")
                                this.link.isGif = true;
                            else
                                this.link.isGif = false;
                        }
                        else {
                            this.link.image = null;
                            this.link.imageWidth = 0;
                            this.link.imageHeight = 0;
                        }
                        this.link.isSet = true;
                        this.linkLoading = false;
                        this.changeDetector.markForCheck();
                        if (this.isEmpty) {
                            this.publishText = "";
                            jQuery(".textarea-publish")[0].innerHTML = "";
                        }
                    }
                    else {
                        console.error("error in link API;");
                        this.linkLoading = false;
                    }
                },
                err => {
                    //error
                    console.error("error in link API;");
                    this.linkLoading = false;
                },
                () => {
                    //final
                }
                );
        }
    }
    resetPublishPicture() {
        jQuery("#preview-image").attr('src', "");
        jQuery("#preview-image").hide();
        this.uploadedPicture = null;
    }
    resetPublish() {
        this.changeDetector.markForCheck();
        jQuery("#file-image").val("");
        jQuery("#file-image-gif").val("");
        jQuery("#preview-image").attr('src', '');
        jQuery("#preview-image").fadeOut();
        this.uploadedPicture = null;
        //this.form.controls.publicationTitle.updateValue('');
        this.titleEnable = false;
        //this.form.controls.publicationText.updateValue('');
        //this.form.controls.publicationYoutubeLink.updateValue('');
        this.youtubeInput = false;
        this.youtubeLink = null;
        jQuery(".yt-in-url").val("");
        jQuery(".youtube-preview").html("");
        this.loadingPublish = false;
        jQuery(".textarea-publish").html("");
        this.closeLinkAPI();
    }
    //add Publication
    publish() {
        if (!this.form.value.publicationText && !this.youtubeLink && !this.uploadedPicture && !this.link.isSet) {
            return;
        }
        this.changeDetector.markForCheck();
        this.loadingPublish = true;
        var data = new FormData();
        data.append('profileId', this.user._id);
        if (this.selectedMenuElement == 0) {
            data.append('confidentiality', 'PUBLIC');
        }
        else {
            data.append('confidentiality', 'PRIVATE');
        }

        data.append('publTitle', this.form.value.publicationTitle);
        data.append('publText', this.form.value.publicationText);
        data.append('publyoutubeLink', this.youtubeLink);
        data.append('publPicture', this.uploadedPicture);
        if (this.link.isSet) {
            data.append('publExternalLink', this.link.url);
        }
        this.changeDetector.markForCheck();

        this.http.post(AppSettings.SERVER_URL + 'publish', data, AppSettings.OPTIONS_POST)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                this.changeDetector.markForCheck();
                if (response.status == "0") {
                    jQuery("#errorMsgDisplay").fadeOut(1000);
                    var elemnt: PublicationBean = response.publication;
                    elemnt.displayed = true;
                    elemnt.isShared = false;
                    this.publicationBeanList.unshift(elemnt);
                    this.resetPublish();
                    this.changeDetector.markForCheck();
                }
                else {

                    this.loadingPublish = false;

                }
            },
            err => { },
            () => {
            }
            );
    }

    //Enable title post
    enableTitlePost() {
        this.titleEnable = !this.titleEnable;

    }

    //change Menu Filter
    changeMenuFilter(newMenufilter: string) {
        this.menuFilter = newMenufilter;
        localStorage.setItem('typePosts', newMenufilter);
        this.publicationBeanList = [];
        this.loadFirstPosts();
    }
    //select Menu Home
    enableSelectMenu() {
        jQuery(".select-menu").toggle();
    }

    changeSelectMenu(choice) {
        this.selectedMenuElement = choice;
    }

    //change Youtube Input
    changeYoutubeInput() {
        jQuery(".yt-in-url").toggle();
    }

    addPhoto() {
        jQuery(("#file-image")).click();
    }
    addPhotoGIF() {
        jQuery(("#file-image-gif")).click();
    }
    changePhoto() {
        jQuery(("#file-profile")).click();
    }
    changePhotoUpload() {
        if (!this.uploadedProfilePicture) {
            return;
        }
        this.changeDetector.markForCheck();
        var data = new FormData();

        data.append('profileId', this.user._id);
        data.append('profilePicture', this.uploadedProfilePicture);
        this.changeDetector.markForCheck();
        this.profilePictLoad= true;
        this.http.post(AppSettings.SERVER_URL + 'updateProfilePicture', data, AppSettings.OPTIONS_POST)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                this.changeDetector.markForCheck();
                if (response.status == "0") {
                    localStorage.setItem('user', JSON.stringify(response.profile));
                    this.loginService.actualize();
                    this.changePhotoCancel();
                    this.uploadedProfilePicture = null;
                    jQuery("#file-profile").val("");
                    jQuery(".profile-photo").css('background-image', 'url(' + response.profile.profilePicture + ')');
                    this.profilePictLoad=false;
                    swal({
                        title: "Photo de profil Modifié!",
                        text: "votre photo de profil a été modifié",
                        type: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(function () { }, function (dismiss) { });

                }
                else {
                    this.profilePictLoad=false;
                    this.changePhotoCancel();

                }
            },
            err => {this.profilePictLoad=false; },
            () => {
            }
            );
    }
    changePhotoCancel() {
        this.uploadedProfilePicture = null;
        jQuery("#file-profile").val("");
        jQuery(".profile-photo").css('background-image', 'url(' + this.userDisplayed.profilePicture + ')');
    }
    //uploading photo or GIF
    uploadPhoto($event) {

        var inputValue = $event.target;
        if (inputValue != null && null != inputValue.files[0]) {
            this.uploadedPicture = inputValue.files[0];
            previewFile(this.uploadedPicture);
            jQuery(".youtube-preview").html("");
            //this.form.controls.publicationYoutubeLink.updateValue('');
            this.closeLinkAPI();

        }
        else {
            this.uploadedPicture = null;
        }
    }

    uploadPhotoGIF($event) {
        var inputValue = $event.target;
        if (inputValue != null && null != inputValue.files[0]) {
            this.uploadedPicture = inputValue.files[0];
            previewFile(this.uploadedPicture);
            jQuery(".youtube-preview").html("");
        }
        else {
            this.uploadedPicture = null;
        }
    }
    updateProfilePicture($event) {

        var inputValue = $event.target;
        if (inputValue != null && null != inputValue.files[0]) {
            this.uploadedProfilePicture = inputValue.files[0];
            previewProfilePicture(this.uploadedProfilePicture);
        }
        else {
            this.uploadedProfilePicture = null;
        }
    }
    updateYoutube() {
        a = jQuery(".yt-in-url");
        if (a.val().indexOf("youtube.com") < 1) //invalide youtube link
        {
            jQuery(".youtube-preview").html("");
            a.val("");
            return;
        }
        try {
            var validatedLink = a.val();
            var code = a.val();
            var video = "";
            var a = code.split("?");
            var b = a[1];
            var c = b.split("&");
            for (var i = 0; i < c.length; i++) {
                var d = c[i].split("=");
                if (d[0] == "v") {
                    video = d[1];
                    break;
                };
            }
            jQuery(".youtube-preview").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + video + '" frameborder="0" allowfullscreen></iframe>');
            this.uploadedPicture = null;
            this.closeLinkAPI();
            this.youtubeLink = validatedLink;
            //this.form.controls.publicationYoutubeLink.updateValue(jQuery(".yt-in-url").val());
            jQuery("#preview-image").hide();

        } catch (err) {
            jQuery(".youtube-preview").html("");
        }
    }

    showPublishBox() {
        this.publishBox = true;
    }
    editDescription() {
        this.descEnable = true;
    }
    saveDescriptionWithEnter(e) {
        e.preventDefault();
        this.saveDescription();
    }
    saveDescription() {
        var descriptionText = jQuery("#descEdit").val();
        this.userDisplayed.about = descriptionText;
        var nvUser: User = this.user;
        nvUser.about = descriptionText;
        this.loginService.actualize();
        this.loginService.updateUser(nvUser);

        let body = JSON.stringify({
            profileId: this.user._id,
            about: descriptionText
        });
        this.http.post(AppSettings.SERVER_URL + 'updateAboutProfile', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                this.changeDetector.markForCheck();
                this.descEnable = false;

            },
            err => { },
            () => {
                this.changeDetector.markForCheck();
            }
            );

        this.changeDetector.markForCheck();

    }

}

function previewFile(uploadedFile) {
    var preview = jQuery('#preview-image');
    var file = uploadedFile;
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        //preview.att.src = reader.result;
        jQuery("#preview-image").attr('src', reader.result);
        jQuery(".file-input-holder").fadeIn(500);
        jQuery("#preview-image").fadeIn(500);

    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function previewProfilePicture(uploadedFile) {
    var preview = jQuery('.profile-photo');
    var file = uploadedFile;
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        //preview.att.src = reader.result;
        jQuery(preview).css('background-image', 'url(' + reader.result + ')');

    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
