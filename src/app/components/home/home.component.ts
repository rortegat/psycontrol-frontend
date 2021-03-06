import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('snav', { static: true }) navbar: MatSidenav;

  public loading: boolean = false;
  public userInfo: User = null;
  public adminRole: boolean = false;

  public panelOpenState: boolean = false;
  public allExpandState = false;
  public slideBool: boolean = false;

  public mobileQuery: MediaQueryList = null;
  private _mobileQueryListener: () => void;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sessionService.loading.subscribe(rsp => this.loading = rsp);
    this.sessionService.currentUser.subscribe(rsp => {
      if (rsp == null)
        this.router.navigate(['/login']);
      else
        this.userInfo = rsp
    });
    this.sessionService.theme.subscribe(rsp => this.slideBool = rsp);
  }

  ngOnInit(): void {
    setTimeout(() => { this.sessionService.loading.next(false) }, 1000);
    this.navbar.open();
    this.getRoles().forEach((role) => {
      if (role === "ADMIN")
        this.adminRole = true;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  changeTheme(): void {
    this.sessionService.changeTheme();
  }

  logOut(): void {
    this.sessionService.removeUserData();
    this.sessionService.removeTokenData();
  }

  getRoles(): string[] {
    let userData = this.sessionService.getUserData()
    return userData.roles
      ? userData.roles
      : null;
  }

}
