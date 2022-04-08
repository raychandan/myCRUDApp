import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from './page404/page404.component';
import { environment } from '../environments/environment';

let authenticatePath = environment.authenticate.basePath;
let pageNotFound = environment.pageNotFoundPath;
let homeBasePath = environment.home.basePath;
let homePath = environment.home.path;
let userPath = environment.user.basePath;


const appRoutes: Routes = [
  { path: authenticatePath, loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  {
    path: pageNotFound,
    component: Page404Component
  },
  { path: homeBasePath, loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: userPath, loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  {
    path: '',
    redirectTo: homeBasePath,
    pathMatch: 'full'
  },
  
  { path: '**', redirectTo: '/' + pageNotFound }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
