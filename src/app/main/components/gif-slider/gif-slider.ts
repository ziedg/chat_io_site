import { Home } from './../home/home';
import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
import { GifBean } from '../../../beans/gif-bean';
import { GifService } from '../../services/gifService';


@Component({
  selector: 'gif-slider',
  templateUrl: './gif-slider.html',
  styleUrls: ['./gif-slider.css']
})
export class GifSlider implements AfterViewInit {

  public GifList: Array<GifBean> = [];
  @Output() myEvent = new EventEmitter();
  
  offset_x_pos:number = 0;
  sliderWidth: number = 120;
  sliderHeight: number = 110;
  sliderBtnWidth: number = 24;
  sliderMarginRight: number = 10;

  //list: Array<number> = [1, 2, 3, 4, 5];

  @ViewChild('slidesContainer') slidesContainer: ElementRef;
  @ViewChild('container') container: ElementRef;

  constructor(private renderer: Renderer2,
              private gifService: GifService) {
        
            this.GifList = gifService.getGifList().list;
  }

  ngAfterViewInit() {
    let containerStyle = this.container.nativeElement.style;
    containerStyle.setProperty('--slider-w', `${this.sliderWidth}px`);
    containerStyle.setProperty('--slider-h', `${this.sliderHeight}px`);
    containerStyle.setProperty('--slider-btn-w', `${this.sliderBtnWidth}px`);
    containerStyle.setProperty('--slider-m-r', `${this.sliderMarginRight}px`);
  }

  translate_it(n:number) {
    let offset_x_n = this.offset_x_pos + n;
    if (offset_x_n <= 0 && offset_x_n > -this.GifList.length) {
      this.offset_x_pos = offset_x_n;
      let offset_x = this.offset_x_pos * (this.sliderWidth + this.sliderMarginRight);
      this.renderer.setStyle(this.slidesContainer.nativeElement,
        'transform',
        `translatex(${offset_x}px)`);
    }
  }

  gifPreview(urlGIF){
    console.log("chiiiild");
    this.myEvent.emit(urlGIF);
}
  
}
