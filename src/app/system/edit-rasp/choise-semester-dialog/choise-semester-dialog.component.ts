import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileUploader} from 'ng2-file-upload';
import {PairService} from '../../pair.service';
import {Time} from '../../../Time';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-choise-semester-dialog',
  templateUrl: './choise-semester-dialog.component.html',
  styleUrls: ['./choise-semester-dialog.component.css']
})
export class ChoiseSemesterDialogComponent {
   selectSem: string;
   selectedFile: File = undefined;
  err: boolean;
  msgErr: String;


  constructor(public dialogRef: MatDialogRef<ChoiseSemesterDialogComponent>,
              private httpService: PairService) { }
  onFileInput(event) {
    console.log(event.target.files);
    if (event.target.files.length !== 0) {
      if ((event.target.files[0].type === 'application/vnd.ms-excel') || (event.target.files[0].type === 'text/xml')) {
        this.selectedFile = event.target.files[0];
        this.err = false;
      } else {
        this.msgErr = 'Неверный тип файла';
        this.err = true;
      }
    } else {
      this.err = false;
    }
  }

  onFileUpload() {
    this.httpService.uploadFile(this.selectedFile, this.selectSem).subscribe((data: any) => {
        this.dialogRef.close(data);
      },
      (response: HttpErrorResponse) => {
        this.msgErr = response.error;
        this.err = true;
        console.log(response.error);
      });
  }

}
