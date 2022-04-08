import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { environment } from '../../environments/environment';

let homePath = environment.home.path;

const routes: Routes = [
  { path: homePath, component: HomeComponent },
  {
    path: '',
    redirectTo: homePath,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
