import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {User} from "../../../beans/user";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../../environments/environment";
import {Http, Response} from "@angular/http";
import {AppSettings} from "../../../shared/conf/app-settings";
import * as pathUtils from "../../../utils/path.utils";
import { RecentRechService } from '../../services/recentRechService';
import {Router} from "@angular/router";


declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: "search-mobile",
  templateUrl: "search-mobile.html"
})

export class SearchMobile {
  searchValue: string = "";
  listSearchUsers: Array<User> = [];
  noSearchResults: Boolean = false;
  showRecentSearch: Boolean;
  RecentSearchList;

  @ViewChild("searchMobileInput") searchInput: ElementRef;
  dislayRechercherHolder: boolean = false;

  constructor(private translate: TranslateService,
              private changeDetector: ChangeDetectorRef,
              private http: Http,
              private recentRechService: RecentRechService,
              private router: Router){
    if (!this.recentRechService.isEmptyList())
      this.RecentSearchList = this.recentRechService.getListRecentRech();

  }

  enableAutocomplete() {
    jQuery(".recherche-results-holder").show();
    jQuery(".upper-arrow-search").show();
    this.changeDetector.markForCheck();
  }

  getListSearchUsers(key: string) {
    this.showRecentSearch = false;
    this.http
      .get(
        environment.SERVER_URL + pathUtils.FIND_PROFILE + key,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.listSearchUsers = [];
          this.noSearchResults = false;
          this.changeDetector.markForCheck();
          for (let i = 0; i < this.listSearchUsers.length; i++) {
            this.listSearchUsers.pop();
            this.changeDetector.markForCheck();
          }
          if (response.status == 0) {
            if (response.profiles)
              for (let i = 0; i < response.profiles.length; i++) {
                this.listSearchUsers[i] = response.profiles[i];
                this.changeDetector.markForCheck();
              }
          }
        },
        err => {
          this.noSearchResults = true;
        },
        () => {
          if (this.listSearchUsers.length == 0) {
            this.disableAutocomplete();
            this.noSearchResults = true;
          } else {
            this.noSearchResults = false;
          }
          this.changeDetector.markForCheck();
        }
      );
  }

  disableAutocomplete() {
    jQuery(".recherche-results-holder-1").hide();
    jQuery(".upper-arrow-search").hide();
  }

  showRecentSearchUsers() {
    if (this.recentRechService.isEmptyList()) {
      this.disableAutocomplete();
      this.showRecentSearch = false;
    } else {
      this.enableAutocomplete();
      this.RecentSearchList = this.recentRechService.getListRecentRech();
      this.showRecentSearch = true;
    }
    this.changeDetector.markForCheck();
  }

  onChange(newValue: string) {
    this.listSearchUsers = [];
    this.enableAutocomplete();
    this.changeDetector.markForCheck();
    if (newValue.length > 1) {
      this.getListSearchUsers(newValue);
    } else {
      if (this.recentRechService.isEmptyList()) {
        this.disableAutocomplete();
      } else {
        this.showRecentSearchUsers();
      }
    }
    this.changeDetector.markForCheck();
  }

  onFocus() {
    this.dislayRechercherHolder = true;
    this.onChange(this.searchInput.nativeElement.value);
    this.checkAutoComplete();
  }

  clearSearchMobile() {
    this.searchValue = "";
    //this.searchInput.nativeElement.value = "";
    this.listSearchUsers.length = 0;
    this.noSearchResults = false;
  }

  checkAutoComplete() {
    if (this.searchValue && this.searchValue.length > 1) {
      this.getListSearchUsers(this.searchValue);
    } else {
      this.enableAutocomplete();
      this.showRecentSearchUsers();
    }
  }

  saveRecentRech(_id, firstName, lastName, profilePicture, profilePictureMin) {
    let newRechUser: string = JSON.stringify({
      _id: _id,
      firstName: firstName,
      lastName: lastName,

      profilePicture: profilePicture,
      profilePictureMin: profilePictureMin
    });
    this.recentRechService.addToListRecentRech(JSON.parse(<string>newRechUser));
    this.changeDetector.markForCheck();
    this.disableAutocomplete();
    this.RecentSearchList = this.recentRechService.getListRecentRech();
    this.router.navigate(["/main/profile", _id]);
  }
}
