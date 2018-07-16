import {Pipe, PipeTransform} from "@angular/core";
import {User} from "../../beans/user";


@Pipe({
  name: "AvailablePicture",
})
export class AvailablePicture implements PipeTransform {
  transform(profile: User) {
    //if(!profile.profile && !profile.profilePictureMin) return this.alternativeProfilePicture;
    let profilePicture:string = profile.profilePictureMin ? profile.profilePictureMin : profile.profilePicture;
    return profilePicture;
  }
}
