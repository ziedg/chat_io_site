import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
import {GifService} from '../../services/gifService';




@Component({
  selector: 'gif-slider',
  templateUrl: './gif-slider.html',
  styleUrls: ['./gif-slider.css']
})
export class GifSlider implements AfterViewInit {

  public UrlGifList = [];
  
  
  gifLimitIndex: number = 15;
  
  previousActiveGifIndex = -1;
  isLoadingMoreGifs: boolean = false;
  isLoadingInitialGifs: boolean = false;

  @Output() myEvent = new EventEmitter();
  @Output() myToggleEvent = new EventEmitter();

  offset_x_pos: number = 0;
  sliderWidth: number = 100;
  sliderHeight: number = 60;
  sliderBtnWidth: number = 22;
  sliderMarginRight: number = 4;

  //list: Array<number> = [1, 2, 3, 4, 5];

  @ViewChild('slidesContainer') slidesContainer: ElementRef;
  @ViewChild('container') container: ElementRef;
  
  

  constructor(private renderer: Renderer2,
              private gifService: GifService, ) {
   this.isLoadingInitialGifs = true; 
  this.gifService.getGifList().then((gifs: any[]) => {
    
    for (let i = 0; i < gifs.length; i++) {
      var GifObject = {Post: gifs[i]["media"][0]["gif"]["url"], Preview: gifs[i]["media"][0]["nanogif"]["url"], Show: true};
      
      this.UrlGifList.push(GifObject); //UrlGifList is undefined

    }
    this.isLoadingInitialGifs = false;
  });

    
  }
  swipeLeft(){
    let offset_x_n: any = this.offset_x_pos - 1;
    console.log("offset_x_n: "+offset_x_n);

    if (offset_x_n == -this.gifLimitIndex) {
      console.log("max leeength");
      this.loadMoreGifs();
    }

    if (offset_x_n <= 0 && offset_x_n > -this.UrlGifList.length) {

      this.offset_x_pos = offset_x_n;
      console.log("offset_x_pos: "+this.offset_x_pos);
      let offset_x = 3 * this.offset_x_pos * (this.sliderWidth + this.sliderMarginRight);
      console.log("offset_x: "+offset_x);
      this.renderer.setStyle(this.slidesContainer.nativeElement,
        'transform',
        `translatex(${offset_x}px)`);
    }
  }
  swipeRight(){
    let offset_x_n: any = this.offset_x_pos + 1;
    console.log("offset_x_n: "+offset_x_n);

    if (offset_x_n == -this.gifLimitIndex) {
      console.log("max leeength");
      this.loadMoreGifs();
    }

    if (offset_x_n <= 0 && offset_x_n > -this.UrlGifList.length) {

      this.offset_x_pos = offset_x_n;
      //console.log("offset_x_pos: "+this.offset_x_pos);
      let offset_x = 3 * this.offset_x_pos * (this.sliderWidth + this.sliderMarginRight);
      //console.log("offset_x: "+offset_x);
      this.renderer.setStyle(this.slidesContainer.nativeElement,
        'transform',
        `translatex(${offset_x}px)`);
    }
  }

  loadMoreGifs() {
    this.isLoadingMoreGifs = true;
    this.gifService.loadMoreGifs().then((gifs: any[]) => {
    
      for (let i = 0; i < gifs.length; i++) {
        var GifObject = {Post: gifs[i]["media"][0]["gif"]["url"], Preview: gifs[i]["media"][0]["nanogif"]["url"], Show: true};
        
        this.UrlGifList.push(GifObject); //UrlGifList is undefined
  
      }
      this.isLoadingMoreGifs = false;
    });
    
    this.gifLimitIndex += 15;
  }

  ngAfterViewInit() {
    let containerStyle = this.container.nativeElement.style;
    containerStyle.setProperty('--slider-w', `${this.sliderWidth}px`);
    containerStyle.setProperty('--slider-h', `${this.sliderHeight}px`);
    containerStyle.setProperty('--slider-btn-w', `${this.sliderBtnWidth}px`);
    containerStyle.setProperty('--slider-m-r', `${this.sliderMarginRight}px`);
  }


  translate_it(n: number) {
    
    let offset_x_n: any = this.offset_x_pos + n;
    console.log("offset_x_n: "+offset_x_n);

    if (offset_x_n == -this.gifLimitIndex) {
      console.log("max leeength");
      this.loadMoreGifs();
    }

    if (offset_x_n <= 0 && offset_x_n > -this.UrlGifList.length) {

      this.offset_x_pos = offset_x_n;
      //console.log("offset_x_pos: "+this.offset_x_pos);
      let offset_x = 3 * this.offset_x_pos * (this.sliderWidth + this.sliderMarginRight);
      //console.log("offset_x: "+offset_x);
      this.renderer.setStyle(this.slidesContainer.nativeElement,
        'transform',
        `translatex(${offset_x}px)`);
    }

  }

  gifPreview(Url) {
    //console.log("chiiiild");
    var urlGIF = Url.Post;
    var j = this.previousActiveGifIndex ;
    
    var i = this.UrlGifList.indexOf(Url);console.log("this is iiiii",i);
    if(j != -1){
      this.UrlGifList[j].Show = true;
    }
    this.UrlGifList[i].Show = false;
    this.previousActiveGifIndex = i;
    this.myEvent.emit(urlGIF);
    
    

  }

  toggleGifSlider(){
    this.myToggleEvent.emit();
  }

}
