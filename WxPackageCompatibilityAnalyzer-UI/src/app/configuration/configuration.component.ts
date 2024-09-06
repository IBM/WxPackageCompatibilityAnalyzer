
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

export interface sourceRequest {
  sourceServerUrl: string;
  sourceServerUsername: string;
  sourceServerPassword: string;
};

export interface sourceRuntimeDetails {
  name: string;
  version:  string;
};

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
 
  public sourceRequest: sourceRequest = {
    sourceServerUrl: "",
    sourceServerUsername: "",
    sourceServerPassword: "",
  };

  public sourceRuntimeDetails = {
    name: "",
    version: ""
  };

  public isConfigBusy: boolean = false;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    "X-wM-AdminUI": "true"
  });

  constructor(private http: HttpClient, private msgService: MessageService) { };

  ngOnInit(): void {
    this.getSourceRuntimeConfig();
    
  }

  private getSourceRuntimeConfig(): void {
    this.isConfigBusy = true;
    this.msgService.infoMessage("Fetching source runtime configuration...");
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/config/source";
    this.http.get<any>(url, {headers: this.headers}).subscribe({next: (resp) => {
      let data = resp.response;
      this.sourceRequest.sourceServerUsername = data?.username;
      this.sourceRequest.sourceServerUrl = data?.url;
      this.sourceRequest.sourceServerPassword= data?.password;
      this.testSourceRuntimeConnection();
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      } else {
        this.msgService.errorMessage(error.error.message);
      }
      console.log("Fetching Source Runtime Configuration error:", error);
      this.isConfigBusy = false;
    }});
  }

  public updateSourceRuntimeConfig(): void {
    if (!this.validateSourceRuntimeConfigInput()) {
      this.msgService.infoMessage("All fields are mandatory.");
    }
    else {
      this.isConfigBusy = true;
      this.msgService.infoMessage("Updating source configuration!");
      let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/config/source";
      this.http.put<any>(url, {request: this.sourceRequest}, {headers: this.headers}).subscribe({next: (resp) => {
        this.msgService.successMessage("Source runtime configuration updated!");
        this.testSourceRuntimeConnection();
      }, error: (error: HttpErrorResponse) => {
        if(error.status=== 401) {
          this.msgService.errorMessage(error.message);
          this.redirectToLoginPage();
        } else {
          this.msgService.errorMessage(error.error.message);
        }
        console.log("Updating Source Runtime Configuration error:", error);
        this.isConfigBusy = false;
      }});
    }
  }

  public validateSourceRuntimeConfigInput(): boolean {
    if (this.sourceRequest.sourceServerUrl == "" || this.sourceRequest.sourceServerUsername == "" || this.sourceRequest.sourceServerPassword == "") {
      return false;
    }
    return true;
  }

  private testSourceRuntimeConnection(): void {
    this.msgService.infoMessage("Testing source runtime connection...");
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/server/source";
    this.http.get<any>(url, {headers: this.headers}).subscribe({next: (resp) => {
      let data = resp.response;
      this.sourceRuntimeDetails.name = data.name;
      this.sourceRuntimeDetails.version = data.version;
      this.msgService.successMessage("Testing Source Runtime Connection successful!");
      this.isConfigBusy = false;
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      } else {
        this.msgService.errorMessage(error.error.message);
      }
      console.log("Testing Source Runtime Connection error:", error);
      this.isConfigBusy = false;
    }});
  }

  private redirectToLoginPage(): void {
    let logout = location.protocol + '//' + location.host;
    window.location.href = logout;
  }

}
