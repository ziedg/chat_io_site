
import {Injectable, Injector} from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ConnectionBackend, XHRBackend, Request } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';

import {Router} from '@angular/router';

//import { Cookie } from 'ng2-cookies/ng2-cookies';

/** Constants */
import * as Constants from './constants';


/**
 * HttpClient
 *
 * Inherits from Angular http class
 * Injects  automatically headers in all http request
 */

@Injectable()
export class HttpClient extends Http {

    http : Http;
    public pendingRequests = 0;
    public showLoading: boolean = false;


    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private injector: Injector) {
        super(_backend,_defaultOptions);

    }

    public get router(): Router {
        return this.injector.get(Router);
    }

    addSecurityHeaders(url:string,method:string,options: RequestOptionsArgs):void {
      if(localStorage.getItem('token')){
        options.headers.set(Constants.X_ACCESS_TOKEN, localStorage.getItem('token'));
      }
    }

    /**
     *
     * @param options
     * @returns {RequestOptionsArgs}
     */
    setOptions(options?: RequestOptionsArgs):RequestOptionsArgs {
        if(!options) {
            options = {};
        }
        if(!options.headers) {
            options.headers = new Headers();
        }
        return options;
    }


    /**
     *  Redefine http get
     *
     * @param url
     * @param options
     * @returns {Observable<Response>}
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.setOptions(options);

        this.addSecurityHeaders(url,'GET',options);
        return this.intercept(super.get(url,options));
    }

    /**
     *  Redefine http delete
     *
     * @param url
     * @param options
     * @returns {Observable<Response>}
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.setOptions(options);

        this.addSecurityHeaders(url,'DELETE',options);
        return this.intercept(super.delete(url,options));
    }

    /**
     * Redefine http post
     *
     * @param url
     * @param body
     * @param options
     * @returns {Observable<Response>}
     */
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.setOptions(options);
        this.addSecurityHeaders(url,'POST',options);
        return this.intercept(super.post(url, body, options));
    }

    /**
     * Redefine http  put
     *
     * @param url
     * @param body
     * @param options
     * @returns {Observable<Response>}
     */
    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.setOptions(options);
        this.addSecurityHeaders(url,'PUT',options);
        return this.intercept(super.put(url, body, options));
    }

    /**
     * intercept http response
     *
     * @param observable
     * @returns {Observable<R>}
     */
    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((err) => {
            if(err.status === Constants.HttpServletResponse.SC_FORBIDDEN) {
                //console.log('Unauthorized request');
                //this.router.navigate( ['error'] );
                return Observable.empty();
            }
            if (err.status === Constants.HttpServletResponse.SC_UNAUTHORIZED){
                //console.log('Forbidden request');
                //this.router.navigate( ['error'] );
                return Observable.empty();
            }
            if (err.status === Constants.HttpServletResponse.SC_INTERNAL_SERVER_ERROR){
                //console.log('Internal server error');
                //this.router.navigate( ['error'] );
                return Observable.empty();
            }
            return Observable.throw(err);
        }).finally(() => {
        });
    }
}
