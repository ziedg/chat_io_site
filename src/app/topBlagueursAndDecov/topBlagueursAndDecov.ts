import {Component, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
/* conf */
import {AppSettings} from '../conf/app-settings';

/* services */
import {LoginService} from '../service/loginService';

/* user  */
import {User} from '../beans/user';

/* Blagueur  */
import {Blagueur} from '../beans/Blagueur';
import {environment} from "../../environments/environment";



@Component({
  moduleId: module.id,
    selector: 'top-blagueurs-decov',
    templateUrl: 'topBlagueursAndDecov.html'
})
export class TopBlagueursAndDecov {
	public topBlagueursDisplayList : Array <Blagueur> = [];
	public DecovDisplayList : Array <Blagueur> = [];

	public topBlagueursList : Array <Blagueur> = [];
	public DecovList : Array <Blagueur> = [];

	public user:User=new User();

	nbBlagueursDisplayed = 0 ;
	nbDecovDisplayed = 0 ;
	nbMaxElements = 3;
	profiles;

  @Output() loadPublications = new EventEmitter<any>();

    constructor(private http: Http, private router: Router, private loginService: LoginService,private changeDetector: ChangeDetectorRef) {
		loginService.actualize();
        this.user = loginService.user;
		this.loadtopBlagueursList();
		this.loadDecovList();
	}
	loadtopBlagueursList(){
		this.http.get(
      environment.SERVER_URL + 'getBlagueursPopulaires/?ProfileId=' + this.user._id, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
				 this.topBlagueursList=response.profiles;
				 for(var i=0;i<this.nbMaxElements && i<response.profiles.length;i++) {
					 this.topBlagueursDisplayList[i]=this.topBlagueursList[i];
					 this.topBlagueursDisplayList[i].position=i;
					 this.changeDetector.markForCheck();

				 }
				 this.nbBlagueursDisplayed=this.nbMaxElements;
				 this.changeDetector.markForCheck();

			},
            err => {
            },
            () => {
            }
            );
	}
	loadDecovList(){
		this.http.get(
      environment.SERVER_URL + 'getProfilesDecouvert/?ProfileId=' + this.user._id, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
				 this.DecovList=response.profiles;
				 for(var i=0;i<this.nbMaxElements && i<response.profiles.length;i++) {
					 this.DecovDisplayList[i]=this.DecovList[i];
					 this.DecovDisplayList[i].position=i;
					 this.changeDetector.markForCheck();

				 }
				 this.nbDecovDisplayed=this.nbMaxElements;
				 this.changeDetector.markForCheck();

			},
            err => {
            },
            () => {
            }
            );
	}
	doNotSubscribeUser(source:string,position:number,profileId:string,blag:Blagueur){
		blag.isSubscribed=false;
		if(source=="Decov") {
			this.DecovDisplayList[position].isSubscribed=false;
			this.DecovDisplayList[position].nbSuivi--;
		}
		else {
			this.topBlagueursDisplayList[position].isSubscribed=false;
			this.topBlagueursDisplayList[position].nbSuivi--;
		}
		this.changeDetector.markForCheck();

		let body = JSON.stringify({
			UserId: this.user._id,
			profileId: profileId
		});

		this.http.post(environment.SERVER_URL + 'removeSubscribe', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {

			},
			err => {},
			() => {
				this.changeDetector.markForCheck();
			}
			);
	}
	subscribeUser(source:string,position:number,profileId:string,blag:Blagueur){
		blag.isSubscribed=true;
		if(source=="Decov") {

			this.DecovDisplayList[position].isSubscribed=true;
			this.DecovDisplayList[position].nbSuivi++;

		}
		else {
			this.topBlagueursDisplayList[position].isSubscribed=true;
			this.topBlagueursDisplayList[position].nbSuivi++;

		}
		this.changeDetector.markForCheck();

		let body = JSON.stringify({
			UserId: this.user._id,
			profileId: profileId
		});

		this.http.post(environment.SERVER_URL + 'subscribe', body, AppSettings.OPTIONS)
			.map((res: Response) => res.json())
			.subscribe(
			response => {
        this.loadPublications.emit();
			if(source=="Decov") {
					if(this.nbDecovDisplayed >= this.DecovList.length) {

					}
					else {
					this.DecovDisplayList[position]=this.DecovList[this.nbDecovDisplayed];
					this.DecovDisplayList[position].position=position;
					this.DecovDisplayList[position].isSubscribed=false;
					this.nbDecovDisplayed++;
					}
			}
			else {
					if(this.nbBlagueursDisplayed >= this.topBlagueursList.length) {

					}
					else {
					this.topBlagueursDisplayList[position]=this.topBlagueursList[this.nbBlagueursDisplayed];
					this.topBlagueursDisplayList[position].position=position;
					this.topBlagueursDisplayList[position].isSubscribed=false;
					this.nbBlagueursDisplayed++;
					}

			}
				this.changeDetector.markForCheck();

			},
			err => {},
			() => {
				this.changeDetector.markForCheck();
			}
			);


	}
}
