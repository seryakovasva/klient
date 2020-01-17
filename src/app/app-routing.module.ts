import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path: 'system', loadChildren: './system/system.module#SystemModule'},
  {path: '', redirectTo: 'system', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

/*@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }*/
