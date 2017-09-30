/**
 * Created by Chaker on 11/02/2017.
 */

import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'camps-fake',
    template: ''
})
export class FakeComponent implements OnInit {

    constructor(private _router:Router,
                private _route:ActivatedRoute)
    { }

    ngOnInit() {
        this._router.navigate(['/main/home']);
    }

}