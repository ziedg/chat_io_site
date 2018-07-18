import { Injectable } from "@angular/core";
import { DetectUrls } from "../../shared/pipes/DetectUrls.pipe";


@Injectable()
export class PublicationTextService {
  detectUrls = new DetectUrls

    addUrls(txt:string):string{
      return this.detectUrls.transform(txt);
    }

    divideText(txt:string){
        const word_letters: number = 5;
    
        const words_max: number = 70;
        const words_marge: number = 10;
    
        const letters_max: number = words_max * word_letters;
        const letters_marge: number = words_marge * word_letters;

        let result = {isLongText: false, firstPart: "", lastPart: ""};

        const lines_max: number = 4;
    
        if (txt !== "null" && txt !== "undefined" && txt.length > 0) {
          let parts = txt.split(" ");
          txt=txt.replace(/<\/div><div>/g,"<br>");
          txt=txt.replace(/<\/div><br><div>/g,"<br>");
          if (parts.length > words_max) {
            result.isLongText = true;
  
            let words_cut: number;
            if (parts.length - words_max < words_marge)
              words_cut = parts.length - words_marge;
            else words_cut = words_max;
  
            result.firstPart = parts.slice(0, words_cut).join(" ");
            result.lastPart = parts.slice(words_cut, parts.length).join(" ");
            //console.log("cut words");
          } else if (txt.length > letters_max) {
            result.isLongText = true;
  
            let letters_cut: number;
            if (txt.length - letters_max < letters_marge)
              letters_cut = txt.length - letters_marge;
            else letters_cut = letters_max;
  
            let cut_end: number = txt.slice(0, letters_cut).lastIndexOf(" ");
            result.firstPart = txt.slice(0, cut_end);
            result.lastPart = txt.slice(cut_end);
            //console.log("cut letters");
          } else {
            result.firstPart = txt;
          }

          if(!result.isLongText) {
            let line_parts = txt.split("<br>");
            if (line_parts.length > lines_max ) {
              result.firstPart = line_parts.slice(0, lines_max).join("<br>");
              result.lastPart = line_parts
                .slice(lines_max, line_parts.length)
                .join("<br>");
              result.isLongText = true;
            }
          }
          //console.log("long text : " + this.isLongText);
        }

        return result
    }
}