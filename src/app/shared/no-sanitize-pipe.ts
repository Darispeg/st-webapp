import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({name: 'noSanitize'})
export class NoSanitizePipe implements PipeTransform
{
    constructor(private domSanitizer: DomSanitizer){}

    transform(html: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }
}

@Pipe({name: 'noSanitizeIndex'})
export class NoSanitizePipeIndex implements PipeTransform
{
    constructor(private domSanitizer: DomSanitizer){}

    transform(html: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }
}