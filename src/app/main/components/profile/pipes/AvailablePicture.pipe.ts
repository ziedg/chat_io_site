import {Pipe, PipeTransform} from "@angular/core";
import {User} from "../../../../beans/user";
import { PublicationBean } from "../../../../beans/publication-bean"


@Pipe({
  name: "AvailablePicture",
})
export class AvailablePicture implements PipeTransform {
  alternativeProfilePicture: string = 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png';
  transform(profile: User|PublicationBean) {
    let profilePicture:string = profile.profilePictureMin ? profile.profilePictureMin : profile.profilePicture;
    profilePicture = profilePicture.includes('avatars') ? this.alternativeProfilePicture : profilePicture;
    return profilePicture;
  }
}
