import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { FileInfo } from "../../models/files.types";
import { FileInfoService } from "./files.service";

@Injectable({
    providedIn: 'root'
})
export class FilesResolver implements Resolve<any>
{
    constructor(private _fileInfoService: FileInfoService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FileInfo[]>
    {
        return this._fileInfoService.getFiles();
    }
}