import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { environment } from '../../environments/environment';
import { AuthGuard } from '../shared/guard/auth.guard';

let userPath = environment.user.basePath;
let DetailPath = environment.user.detailPath;

const routes: Routes = [{ path: DetailPath, component: UserDetailComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
