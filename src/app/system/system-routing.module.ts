import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GroupComponent} from './group/group.component';
import {TeachersComponent} from './teachers/teachers.component';
import {CreateRaspComponent} from './create-rasp/create-rasp.component';
import {EditRaspComponent} from './edit-rasp/edit-rasp.component';
import {SystemComponent} from './system.component';

const routes: Routes = [
  {path: '', component: SystemComponent, children: [
      {path: 'groups', component: GroupComponent},
      {path: 'teachers', component: TeachersComponent},
      {path: 'myrasp', component: CreateRaspComponent},
      {path: 'changerasp', component: EditRaspComponent}
      ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class SystemRoutingModule { }
