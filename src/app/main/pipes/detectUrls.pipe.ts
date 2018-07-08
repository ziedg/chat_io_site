import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
    name: "DetectUrls",
})

export class DetectUrls implements PipeTransform {
    regex_url: RegExp = /(^|>|\s)\s?((https?:\/\/)?([a-z0-9]{1,12}\.){1,2}[a-z]{2,3}(\/[^\s<]*)?\s?(?=(\s|<|$)))/gim;
    regex_long_url: RegExp = /(>[^<]{30})([^<]{10,})(<\/a>)/gi;


    transform(txt:string):string {
        console.log("detect urls");
        console.log(this.regex_url.test(txt));
        txt = txt.replace(this.regex_url, '$1<a href="$2" target="_blank">$2</a>');
        txt = txt.replace(this.regex_long_url, " $1...$3");
        return txt;
    }
}