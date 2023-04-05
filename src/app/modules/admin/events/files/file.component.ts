import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ItemsService } from "../items.service";
import { FileInfoService } from "./files.service";

export interface DialogData {
    eventKey: string;
    name: string;
    urlImage: string;
}

@Component(
    {
        selector: 'file-component',
        templateUrl: './file.component.html'
})
export class FileComponentDialog
{
    imageSrc: any;
    selectedFiles: FileList;
    currentFile: File;
    progress = 0;
    message = '';
    fileInfos: Observable<any>;
    eventKey: string;
    
    constructor(
        public dialogRef: MatDialogRef<FileComponentDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _filesService: FileInfoService,
        private _eventService: ItemsService
    ){}

    selectFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            this.selectedFiles = event.target.files;
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        }
    }

    upload(): void {
        this.currentFile = this.selectedFiles.item(0);
        this._filesService.upload(this.data.eventKey, this.currentFile).subscribe(
            event => {
                this.message = 'Upload the file!';
            },
            error => {
                this.message = 'Could not upload the file!';
                this.currentFile = undefined;
            }
        );
        this.selectedFiles = undefined;
        this.dialogRef.close();
    }

    onNoClick(): void{
        this.dialogRef.close();
    }
}
