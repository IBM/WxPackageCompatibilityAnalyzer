import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WxPackageCompatibilityAnalyzer';

  public hideHeaderAndSideMenu = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe({next: (e) => {
      if(e instanceof NavigationEnd) {
        if(e.url === "/login") {
          this.hideHeaderAndSideMenu = true;
        } else {
          this.hideHeaderAndSideMenu = false;
        }
      }
    }});
  }
}
