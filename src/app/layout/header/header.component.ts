import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TokenServiceService } from '../../shared/services/token-service.service';
import { SocialAuthService } from "angularx-social-login";
import { AuthServiceService } from '../../shared/services/auth-service.service';
import { RouterService } from 'src/app/shared/services/router.service';
import { SocketService } from 'src/app/shared/services/socket.service'


declare var $: any; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeClass = 'active';
  authenticatePath = environment.authenticate.basePath;
  signinPath = this.authenticatePath+ '/' + environment.authenticate.signin;
  signupPath = this.authenticatePath+ '/' + environment.authenticate.signup;
  homePath = environment.home.path;
  userPath = environment.user.basePath + '/' +environment.user.detailPath;
  isLoggedIn = false;
  constructor(private router: Router, private tokenService: TokenServiceService, private SocialauthService: SocialAuthService, private authService: AuthServiceService,private routerService: RouterService,private socketService: SocketService) { }

  ngOnInit(): void {
    this.tokenService.data.subscribe(response => {
      if(this.authService.isAuthenticated()){
        this.isLoggedIn = true
      }else{
        this.isLoggedIn = false
      }
    });
    if(this.authService.isAuthenticated()){
      this.isLoggedIn = true
    }else{
      this.isLoggedIn = false
    }

    this.socketService.socketConnection().subscribe(data=>{
      console.log("Socket Connected>>>>",data);
    })
  }

  toggle(){
    const nav = $("#topnav");
    nav.attr('class') === "topnav" ? nav.addClass('responsive') : nav.attr('class', 'topnav');
  }

  untoggle(){
    const nav = $("#topnav");
    nav.attr('class', 'topnav');
  }

  logout(){
    const nav = $("#topnav");
    nav.attr('class', 'topnav');
    this.authService.logout();
    this.SocialauthService.signOut();
    this.routerService.redirectHome();
    this.isLoggedIn = false;
  }

}
