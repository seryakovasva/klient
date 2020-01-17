import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

// import { OriginComponent } from './origin/origin.component';
import { SystemRoutingModule} from './system-routing.module';
import { SystemComponent} from './system.component';
import {MY_FORMATS, TableComponent} from './table/table.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule, MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule, MatProgressSpinnerModule,
  MatPseudoCheckboxModule,
  MatSelectModule, MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule, MatToolbarModule, MatTooltipModule,

} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import { GroupComponent } from './group/group.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import { TeachersComponent } from './teachers/teachers.component';
import {AuthModule} from '../auth/auth.module';
import { CreateRaspComponent } from './create-rasp/create-rasp.component';
import {DialogRaspComponent} from './edit-rasp/dialog-rasp/dialog-rasp.component';
import { EditRaspComponent } from './edit-rasp/edit-rasp.component';
import { AddLessionComponent } from './create-rasp/add-lession/add-lession.component';
import { AddKonsultComponent } from './edit-rasp/add-konsult/add-konsult.component';
import { AddPairComponent } from './edit-rasp/add-pair/add-pair.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {FileUploadModule} from 'ng2-file-upload';
import {ChoiseSemesterDialogComponent} from './edit-rasp/choise-semester-dialog/choise-semester-dialog.component';
import { AddInfofGroupsComponent } from './edit-rasp/add-infof-groups/add-infof-groups.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EditTableComponent } from './edit-rasp/edit-table/edit-table.component';


@NgModule({
  imports: [
    SystemRoutingModule,
    CommonModule,

    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    /*BrowserAnimationsModule,
    BrowserModule,*/
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatPseudoCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    AuthModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    AngularFileUploaderModule,
    FileUploadModule,
    MatPaginatorModule
  ],
  declarations: [
//     OriginComponent,
    SystemComponent,
    TableComponent,
    GroupComponent,
    TeachersComponent,
    CreateRaspComponent,
    DialogRaspComponent,
    EditRaspComponent,
    AddLessionComponent,
    AddKonsultComponent,
    AddPairComponent,
    ChoiseSemesterDialogComponent,
    AddInfofGroupsComponent,
    EditTableComponent,
  ],
  entryComponents: [
    DialogRaspComponent,
    AddLessionComponent,
    AddKonsultComponent,
    AddPairComponent,
    ChoiseSemesterDialogComponent,
    AddInfofGroupsComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class SystemModule { }

