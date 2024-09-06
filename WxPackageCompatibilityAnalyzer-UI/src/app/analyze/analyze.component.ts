import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { MessageService } from '../services/message.service';
import { IconService } from '../services/icon.service';

export interface targetRequest {
  targetServerUrl: string;
  targetServerUsername: string;
  targetServerPassword: string;
};

@Component({
  selector: 'app-openapi',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})

export class AnalyzeComponent implements OnInit {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    "X-wM-AdminUI": "true"
  });

  public targetRequest:targetRequest = {
    targetServerUrl: "",
    targetServerUsername: "",
    targetServerPassword: ""
  };

  public assetType: string = "resource";
  public action: string = "download-as-csv";

  showTargetRuntimeConfigForm: boolean = false; 
  isTargetRuntimeEnabled: boolean = false;
  responseData: any;
  
  public packageList: string[] = [];
  public packageName: string = "";
  public isCsvDownloading = false;
  
  public aclDependencies: any = {};
  public resourceDependencies: any = {};
  
  public iconList: any;
  
  constructor(private http: HttpClient, private msgService: MessageService, private iconService: IconService) { };
  
  ngOnInit(): void {
    this.iconList = this.iconService.getIcons();
    this.getSourcePackageList(); // Get source package list
    this.getTargetRuntimeConfig(); // Get target runtime config
  }

  private getSourcePackageList(): void {
    this.msgService.infoMessage("Fetching source package list...");
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/packages/source";
    this.http.get<any>(url, {headers: this.headers}).subscribe({next: (resp) => {
      if (resp.response && resp.response.packages) {
        this.packageList = resp.response.packages.map((pkg: { name: any; }) => pkg.name);
        this.packageName = this.packageList[0];
      }
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      } else {
        this.msgService.errorMessage(error.error.message);
      }
      console.log("Fetching Source Package List error:", error);
    }});
  }

  private getTargetRuntimeConfig(): void {
    this.msgService.infoMessage("Fetching target runtime configuration...");
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/config/target";
    this.http.get<any>(url, {headers: this.headers}).subscribe({next: (resp) => {
      let data = resp.response;
      this.targetRequest.targetServerUrl = data.url; 
      this.targetRequest.targetServerUsername = data.username; 
      this.targetRequest.targetServerPassword= data?.password;
      
      this.isTargetRuntimeEnabled = true;
      this.showTargetRuntimeConfigForm = true;
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      } else if (error.status === 404) {
        this.isTargetRuntimeEnabled = false;
        this.showTargetRuntimeConfigForm = false
      } else {
        console.log("Fetching Target Runtime Config error;", error);
        this.msgService.errorMessage(error.error.message);
      }
    }});
  }
  
  public onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isTargetRuntimeEnabled = input.checked;
    if (this.isTargetRuntimeEnabled) {
      this.addDefaultTargetRuntimeConfig();    // Add default target runtime configuration
    } else {
      this.removeTargetRuntimeConfig(); // Remove target runtime configuration
    }
  }
  
  private addDefaultTargetRuntimeConfig(): void {
    this.msgService.infoMessage("Adding default target runtime configuration...");
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/config/target";
    const defaultTargetConfig: targetRequest = {
      targetServerUrl: 'http://locahost:5555/',
      targetServerUsername: 'Administrator',
      targetServerPassword: 'manage'
    };
    this.http.post<any>(url, defaultTargetConfig, {headers: this.headers}).subscribe({next: (resp) => {
      this.msgService.successMessage("Default target runtime configuration added!");
      this.getTargetRuntimeConfig(); // Refresh the target configuration
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      } else {
        this.msgService.errorMessage(error.error.message);
      }
      console.error('Adding Default Target Runtime Config error:', error);
    }});
  }

  private removeTargetRuntimeConfig(): void {
    this.msgService.infoMessage("Deleting target runtime configuration...");
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/config/target";
    this.http.delete<any>(url, {headers: this.headers}).subscribe({next: (resp) =>{
      this.msgService.successMessage("Target runtime configuration deleted!");
      this.isTargetRuntimeEnabled = false;
      this.showTargetRuntimeConfigForm = false;
    }, error: (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      } else {
        console.error('Deleting Target Runtime Config error:', error);
        this.msgService.errorMessage(error.error.message);
      }
    }});
  }

  public updateTargetRuntimeConfigAndAnalyzeDependencies(): void {
    if(this.packageName === undefined || this.packageName === "") {
      this.msgService.infoMessage("Source Package Name is mandatory.");
      return;
    }
    if (this.isTargetRuntimeEnabled) {
      if(this.validateTargetRuntimeConfigInput()) {
        let updateUrl = "/restv2/WxPackageCompatibilityAnalyzerAPI/config/target";
        this.http.put<any>(updateUrl, {request: this.targetRequest}, {headers: this.headers}).subscribe({next: (resp) => {
          this.analyzeDependencies();
        }, error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.msgService.errorMessage(error.message);
            this.redirectToLoginPage();
          } else {
            this.msgService.errorMessage(error.error.message);
            console.error('Updating Target Runtime Config error:', error);
          }
        }});
      } else {
        this.msgService.infoMessage("All Target Runtime Configuration fields are mandatory.");
      }
    } else {
      this.analyzeDependencies();
    }
  }

  public validateTargetRuntimeConfigInput(): boolean {
    if (this.targetRequest.targetServerUrl == "" || this.targetRequest.targetServerUsername == "" || this.targetRequest.targetServerPassword == "") {
      return false;
    }
    return true;
  }

  private async analyzeDependencies(): Promise<void> {
    //this.isAnalyzeBusy = true;
    if(this.assetType == 'resource'){
      await this.analyzeResourcesDependencies();
    }
    else if(this.assetType == 'acl'){
      await this.analyzeACLsDependencies();
    }

  }

  private async analyzeResourcesDependencies(): Promise<void> {
    this.msgService.infoMessage("Analyzing resources dependencies...");
    this.resourceDependencies = {};
    
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/analyze/assets/dependencies"
    this.http.post<any>(url, {request: { packageName: this.packageName}}, {headers: this.headers}).subscribe({next: (resp) => {
      this.resourceDependencies = resp?.response;
      //Handelling type/subtype for corner cases- [Map service & Websockets]
      this.handleAssetsCornerCases();
    }, error: (error: HttpErrorResponse) => {
      if(error.status=== 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      }
      this.msgService.errorMessage(error.error.message);
      console.log("Analyzing Resources Dependencies error:", error);
    }});
  }

  private async analyzeACLsDependencies(): Promise<void> {
    this.msgService.infoMessage("Analyzing ACLs dependencies...");
    this.aclDependencies = {};
    let url = "/restv2/WxPackageCompatibilityAnalyzerAPI/analyze/acls"
    this.http.post<any>(url, {request: {packageName: this.packageName}}, {headers: this.headers}).subscribe({next: (resp) => {
      this.aclDependencies = resp?.response;
    }, error: (error: HttpErrorResponse) => {
      if(error.status=== 401) {
        this.msgService.errorMessage(error.message);
        this.redirectToLoginPage();
      }
      this.msgService.errorMessage(error.error.message);
      console.log("Analyzing ACLs Dependencies error:", error);
    }});
  }

  //Handelling type/subtype for corner cases- [Map service & Websockets]
  //handelling '/' on asset/dependent name
  handleAssetsCornerCases(){
    for(let pkg of this.resourceDependencies.packages){
      for (let asset of pkg.assets) {
        if(asset.name.includes('/')){
          asset.name=asset.name.split('/')[1];
        }
        if (asset?.type.value == 'flow' && asset.type?.subtype == "map-service") {
          asset.type.value = 'map-service';
        }
        if (asset?.type.value == 'webMethods' && asset.type?.subtype == "WebSocket") {
          asset.type.value = 'WebSocket';
        }
        for(let dependent of asset.dependents){
          if(dependent.name.includes('/')){
            dependent.name=dependent.name.split('/')[1];
          }
          if (dependent?.type.value == 'flow' && dependent.type?.subtype == 'map-service') {
            dependent.type.value = 'map-service';
          }
          if (dependent?.type.value == 'webMethods' && dependent.type?.subtype == 'WebSocket') {
            dependent.type.value = 'WebSocket';
          }
        }
      }
    }
  }


  downloadCsv() {
    this.msgService.infoMessage("Downloading CSV file...");
    this.isCsvDownloading = true;
    let csv = '';
    let fileName = '';
    if (this.assetType == 'resource') {
      let csvText = 'Package name,Is Package Installed?,Resource Namespace,Is Resource Available?,Resource Type,Dependent Namespace,Dependent Type\n'
      for (let pkg of this.resourceDependencies.packages) {
        for (let asset of pkg.assets) {
          for (let dependent of asset.dependents) {
            csvText = csvText + `${pkg.name},${pkg.isInstalled},${asset.name},${asset.isAvailable},${asset.type.value}/${asset.type.subtype},${dependent.name},${dependent.type.value}/${dependent.type.subtype}\n`;
          }
        }
      }
      csv = csvText;
      fileName = `${this.packageName}_resources_report.csv`
    }
    else if (this.assetType == 'acl') {
      let csvText = 'Resource Name, Read ACL, Read ACL Availability, Write ACL, Write ACL Availability, Execute ACL, Execute ACL Availability, List ACL Dependence, List ACL Availability\n';
      let mainList: any = {};
      for (let acl of this.aclDependencies.acls) {
        let aclName = acl.name;
        let aclAvl = acl.isAvailable;
        // mapping/parsing over ACL object's KEYS
        Object.keys(acl).map(dependent => {
          //If the key is a 'dependent' variable [eg: readDependent, writeDependent]
          if (dependent.includes('Dependents')) { 
            //Initializing the list of Dependent [eg: readDependent[], writeDependent[]]
            let depList = acl[dependent]
            if (depList.length > 0) {
              for (let dep of depList) {
                let aclDep = {
                  'aclName': aclName,
                  'aclAvl': aclAvl,
                  'type': dependent
                }
                if (!mainList[dep.name]) {
                  mainList[dep.name] = []
                  mainList[dep.name].push(aclDep)
                } else {
                  mainList[dep.name].push(aclDep)
                }
              }
            }
          }
        })
      }
      //You may console the 'mainList' variable here to know what happened in the above code
      //Below code is the generate the csv from the above formatted json in mainList
      Object.keys(mainList).map(service => {
        let record = [service,,,,,,,,];
        if(mainList[service].length>0){
          for(let dep of mainList[service]){
            if(dep.type.includes('read')){
              record[1]=dep.aclName;
              record[2]=dep.aclAvl;
            }
            if(dep.type.includes('write')){
              record[3]=dep.aclName;
              record[4]=dep.aclAvl;
            }
            if(dep.type.includes('execute')){
              record[5]=dep.aclName;
              record[6]=dep.aclAvl;
            }
            if(dep.type.includes('list')){
              record[7]=dep.aclName;
              record[8]=dep.aclAvl;
            }
          }
          csvText += `${record.join(',')}\n`;
        }
      })
      csv = csvText;
      fileName = `${this.packageName}_acls_report.csv`;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // a.download = `${this.packageName}_report.csv`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.isCsvDownloading = false;
  }
  
  private redirectToLoginPage(): void {
    let logout = location.protocol + '//' + location.host;
    window.location.href = logout;
  }

  public isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
}

