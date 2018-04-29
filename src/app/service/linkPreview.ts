import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Input, Output, EventEmitter, Component, ChangeDetectorRef, ChangeDetectionStrategy,Injectable} from '@angular/core';
import 'rxjs/add/operator/map';


/* conf */
import { AppSettings } from '../conf/app-settings';
import { LinkView } from "../service/linkView";
/*bean*/
import { LinkBean } from '../beans/linkBean';
import {environment} from "../../environments/environment";
@Injectable()
export class LinkPreview {
    public linkToPreview: LinkBean = new LinkBean();
    public returnerLink =new LinkBean();
    /* constructor  */

    constructor(private router: Router, private http: Http, private linkView: LinkView, private changeDetector: ChangeDetectorRef) {

    }
    public reset()
    {
        this.returnerLink.initialise();

    }
    public callback : () =>{():LinkBean}

    public linkAPI(publishText,oldLink:LinkBean,linksArray) {
        //var linkURL = this.publishText;
        //var linkURL = this.publishText.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);
        {
            var source = (publishText || '').toString();
            var myArray = this.linkView.getListLinks(publishText);
            if (!myArray.length) {
                return 1;
            }
            var linkURL = myArray[0];
            console.log(linkURL);
            if (linkURL == this.linkToPreview.url) {
                return 1;
            }
            this.linkToPreview=oldLink;
            this.http.get(
              environment.SERVER_URL + 'getOpenGraphData?url=' + linkURL, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response.results.success) {
                        this.linkToPreview.url = linkURL.substring(0, linkURL.length - 6);
                        this.linkToPreview.title = response.results.data.ogTitle;
                        this.linkToPreview.description = response.results.data.ogDescription;
                        if (response.results.data.ogImage) {
                            this.linkToPreview.image = response.results.data.ogImage.url;
                            this.linkToPreview.imageWidth = response.results.data.ogImage.width;
                            this.linkToPreview.imageHeight = response.results.data.ogImage.height;
                        }
                        else {
                            this.linkToPreview.image = null;
                            this.linkToPreview.imageWidth = 0;
                            this.linkToPreview.imageHeight = 0;
                        }
                        this.linkToPreview.isSet = true;

                  
                        this.returnerLink = this.linkToPreview;
                        linksArray.push(this.linkToPreview);
                        console.error(response);
                        this.changeDetector.markForCheck();
                    }
                    else {
                        console.error("error in link API;");

                    }
                },
                err => {
                    //error
                    console.error("error in link API;");

                },
                () => {
                    //final
                }
                );


        }

    }
public change(variabke)
{
    variabke="string";
}

}
