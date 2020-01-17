import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialogRef} from '@angular/material';
import {PairService} from '../../pair.service';
import {FileUploader} from 'ng2-file-upload';
const URL = "http://localhost:8080/webservice-1.0-SNAPSHOT/main/inputFile2";

@Component({
  selector: 'app-add-infof-groups',
  templateUrl: './add-infof-groups.component.html',
  styleUrls: ['./add-infof-groups.component.css']
})
export class AddInfofGroupsComponent{
  selectedFile: File = undefined;
  error: boolean;
  msgErr: String;
  fileType: boolean = false;
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'file'});

  constructor(public dialogRef: MatDialogRef<AddInfofGroupsComponent>,
              private httpService: PairService) { }

  // ngOnInit() {
  //   this.fileType ;
  // }

  onFileInput(event) {
    console.log(event.target.files);
    if (event.target.files.length !== 0) {
      if (event.target.files[0].type === 'text/xml') {
        this.selectedFile = event.target.files[0];
        this.fileType = true;
        console.log(this.selectedFile.type);
        this.error = false;
      } else {
        this.msgErr = 'Неверный тип файла';
        this.error = true;
      }
    } else {
      this.error = false;
    }
  }


  onFileUpload() {
    this.httpService.addInfOfGroups(this.selectedFile).subscribe((data: any) => {
        this.dialogRef.close(data);
      },
      (response: HttpErrorResponse) => {
        this.msgErr = response.error;
        this.error = true;
        console.log(response.error);
      });
  }
}
