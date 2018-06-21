import { Injectable } from '@angular/core';

import { GifBean } from '../../beans/gif-bean';
import { GifListBean } from '../../beans/gif-list-bean';


@Injectable()
export class GifService {
     nvList:GifListBean = new GifListBean();
    /* constructor  */
    constructor(){
        
        var nvgif:GifBean = new GifBean();
        // list people
        //nvList.title="persone";
        this.nvList.list=[];

        nvgif= new GifBean();
        this.nvList.list.push(this.addtoListGif("https://9gag.com/gag/aq7W4rj","https://images-cdn.9gag.com/photo/aq7W4rj_700b.jpg"));
        this.nvList.list.push(this.addtoListGif("https://9gag.com/gag/azXONKN","https://images-cdn.9gag.com/photo/azXONKN_700b.jpg"));
        this.nvList.list.push(this.addtoListGif("https://9gag.com/gag/aq760dZ","https://images-cdn.9gag.com/photo/aq760dZ_700b.jpg"));
        

        

        

    }
    addtoListGif(urlGIF,imageGIF):GifBean{
        var nvgif:GifBean= new GifBean();
        nvgif.urlGIF=urlGIF;
        nvgif.imageGIF=imageGIF;
        return nvgif;
    }
    getGifList(): GifListBean{
        return this.nvList;
    }

}