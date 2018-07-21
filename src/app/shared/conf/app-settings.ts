import { Headers, RequestOptions } from '@angular/http';

import { environment } from '../../../environments/environment';

export class AppSettings {


    public static get OPTIONS(): RequestOptions {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json; charset=UTF-8');
      return new RequestOptions({ headers: headers});
    }

    public static get OPTIONS_POST(): RequestOptions {
        let headers_post = new Headers();
        return new RequestOptions({ headers: headers_post });
    }
    public static get OPTIONS_POST_ENCODED(): RequestOptions {
        let headers_post_encoded = new Headers();
        return new RequestOptions({ headers: headers_post_encoded });
    }
	 public static get OPTIONSFB(): RequestOptions {
        let headers = new Headers();
		headers.append('Access-Control-Allow-Credentials', 'true');

        return new RequestOptions({ headers: headers});
    }

    public static Redirect(route:string) {
        location.href = environment.SERVER_URL+route;
    }

}
