import {Component} from "@angular/core";
import {User} from "../../../beans/user";
import {TranslateService} from "@ngx-translate/core";


@Component({
  moduleId: module.id,
  selector: "search-mobile",
  templateUrl: "search-mobile.html"
})

export class SearchMobile {
  searchValue: string;
  listSearchUsers: Array<User> = [];

  constructor(private translate: TranslateService){

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
    this.searchRes2.nativeElement.style.display = "block!important";
    this.onChange(this.searchInput.nativeElement.value);
    this.checkAutoComplete();
  }

  clearSearchMobile() {
    this.searchInput.nativeElement.value = "";
    this.listSearchUsers.length = 0;
    this.noSearchResults = false;
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
