import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/_services/navigation.service';

@Component({
    selector     : 'app-sidebar',
    templateUrl  : './sidebar.component.html',
    styleUrls    : ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent
{
    navigation: any;
    _router: any;
  isToggleSideBar = false;

    /**
     * Constructor
     */
    constructor(
        private navigationService: NavigationService,
        private router: Router
    )
    {
        this._router = router;
        this.navigation = this.navigationService.getCurrentNavigation();
    }
    addSidebarClass = () => {
        return {
          "hide-menu": this.isToggleSideBar,
          "show-menu-toggle": this.isToggleSideBar,
        };
      };
      addButtonClass = () => {
        return {
          click: this.isToggleSideBar,
        };
      };
      click = () => {
        this.isToggleSideBar = !this.isToggleSideBar;
        let appToolbar = document.getElementsByClassName("app-toolbar");
        let appMainContent = document.getElementsByClassName("app-main-content");
        let sideBar = document.getElementsByClassName("sidebar");
        // Set toggle padding app-toolbar
        for (let i = 0; i < appToolbar.length; i++) {
          if (this.isToggleSideBar == true) {
            appToolbar[i].classList.add("pd-100");
            appToolbar[i].classList.remove("ease-in-padding");
          } else {
            appToolbar[i].classList.remove("pd-100");
            appToolbar[i].classList.add("ease-in-padding");
          }
        }
        // Set toggle width app-main-content
        for (let i = 0; i < appMainContent.length; i++) {
          if (this.isToggleSideBar == true) {
            appMainContent[i].classList.add("full-screen");
            appMainContent[i].classList.remove("ease-in");
          } else {
            appMainContent[i].classList.remove("full-screen");
            appMainContent[i].classList.add("ease-in");
          }
        }
        // Set toggle width sidebar
        for (let i = 0; i < sideBar.length; i++) {
          // sideBar[s].classList.toggle("set-width-45");
          if (this.isToggleSideBar == true) {
            sideBar[i].classList.remove("ease-in-width");
            sideBar[i].classList.add("set-width-45");
          } else {
            sideBar[i].classList.add("ease-in-width");
            sideBar[i].classList.remove("set-width-45");
          }
        }
      };
}
