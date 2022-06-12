import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { FileInfo } from '../../models/files.types';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FileInfoService {
    
    private _file: BehaviorSubject<FileInfo | null> = new BehaviorSubject(null);
    private _files: BehaviorSubject<FileInfo[] | null> = new BehaviorSubject(null);

    private _new:string = '00000000-0000-0000-0000-000000000000';

    constructor(private _httpClient: HttpClient){}

    get files$(): Observable<FileInfo[]>
    {
        return this._files.asObservable();
    }

    get file$(): Observable<FileInfo>
    {
        return this._file.asObservable();
    }

    upload(eventKey: string, file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        const req = new HttpRequest('POST', `${environment.APIurl}/events/${eventKey}/upload`, formData, {
            reportProgress: true,
            responseType: 'json'
        });

        return this._httpClient.request(req);
    }

    getFiles(): Observable<FileInfo[]>
    {
        return this._httpClient.get<FileInfo[]>(`${environment.APIurl}/files`)
        .pipe(
            tap((files) => {
                this._files.next(files);
            })
        );
    }
}