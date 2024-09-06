import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { IconService } from '../services/icon.service';

@Component({
  selector: 'app-analyze-compatibility',
  templateUrl: './analyze-compatibility.component.html',
  styleUrls: ['./analyze-compatibility.component.css']
})

export class AnalyzeCompatabilityComponent implements OnInit {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    "X-wM-AdminUI": "true"
  });

  public packageList: string[] = []; // Source Package List
  public packageName: string = ""; // Selected Package Name
  public runtimeType: string = "ER"; // Selected Runtime Type
  public action: string = "download-as-csv"; // Selected Action
  public iconList: any; // Icon List
  public isCsvDownloading = false;

  public respResources: any = [];
  public respReferences: any = [];
  
  constructor(private http: HttpClient, private msgService: MessageService, private iconService: IconService) {}
  
  ngOnInit(): void {
    this.iconList = this.iconService.getIcons();
    this.getSourcePackageList();
  }

  private getSourcePackageList(): void {
    this.msgService.infoMessage("Fetching source package list...");
    const url = "/restv2/WxPackageCompatibilityAnalyzerAPI/packages/source";
    this.http.get<any>(url, {headers: this.headers}).subscribe({next: (resp) => {
      if(resp.response && resp.response.packages) {
        this.packageList = resp.response.packages.map((pkg: { name: any; }) => pkg.name);
        this.packageName = this.packageList[0];
      }
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.redirectToLoginPage();
      }
      console.log("Fetching Source Package List error: ", error);
      this.msgService.errorMessage(error.message);
    }});
  }

  public analyze(): void {
    this.msgService.infoMessage("Analyzing compatibility...");
    const requestData = {
      request: {
        packageName: this.packageName,
        runtimeType: this.runtimeType
      }
    };
    const url = "/restv2/WxPackageCompatibilityAnalyzerAPI/analyze/assets/compatibility";
    this.http.post<any>(url, requestData, {headers: this.headers}).subscribe({next: (resp) => {
      if(resp.response) {
        this.respResources = resp.response.resources;
        this.respReferences = resp.response.references;
      }
    }, error: (error: HttpErrorResponse) => {
      if(error.status === 401) {
        this.redirectToLoginPage();
      }
      this.msgService.errorMessage(error.message);
      console.log("Analyzing Compatitibility error:", error);
    }});
  }

  public executeAction() {
    if(this.action === "download-as-csv") {
      this.msgService.infoMessage("Downloading CSV file...");
      this.downloadCSV();
    } else {
      this.msgService.errorMessage("Invalid action!");
    }    
  }
  
  
  private downloadCSV() {
    this.isCsvDownloading = true;
    // Generate CSV for resources
    let resourceCsv = this.generateCSVForResources();
    const resourceBlob = new Blob([resourceCsv], { type: 'text/csv' });
    const resourceUrl = URL.createObjectURL(resourceBlob);
    const resourceLink = document.createElement('a');
    resourceLink.href = resourceUrl;
    resourceLink.download = `${this.packageName}_resources_report.csv`;
    document.body.appendChild(resourceLink);
    resourceLink.click();
    document.body.removeChild(resourceLink);
    URL.revokeObjectURL(resourceUrl);

    // Generate CSV for references
    let referenceCsv = this.generateCSVForReferences();
    const referenceBlob = new Blob([referenceCsv], { type: 'text/csv' });
    const referenceUrl = URL.createObjectURL(referenceBlob);
    const referenceLink = document.createElement('a');
    referenceLink.href = referenceUrl;
    referenceLink.download = `${this.packageName}_references_report.csv`;
    document.body.appendChild(referenceLink);
    referenceLink.click();
    document.body.removeChild(referenceLink);
    URL.revokeObjectURL(referenceUrl);
    this.isCsvDownloading = false;
  }

  private generateCSVForResources(): string {
    let csvText = 'Name,Type,Severity,Message,Recommendation\n';
    for (let resource of this.respResources) {
      csvText += `${this.escapeCSVText(resource.name)},${this.escapeCSVText(resource.type)},${this.escapeCSVText(resource.severity)},${this.escapeCSVText(resource.message)},${this.escapeCSVText(resource.recommendation)}\n`;
    }
    return csvText;
  }

  private generateCSVForReferences(): string {
    let csvText = 'Name,Type,Severity,Message,Recommendation,Dependents\n';
    for (let reference of this.respReferences) {
      let dependents = reference.dependents.map((dep: any) => `${dep.name} (${dep.type.value})`).join('; ');
      csvText += `${this.escapeCSVText(reference.name)},${this.escapeCSVText(reference.type)},${this.escapeCSVText(reference.severity)},${this.escapeCSVText(reference.message)},${this.escapeCSVText(reference.recommendation)},${this.escapeCSVText(dependents)}\n`;
    }
    return csvText;
  }

  private escapeCSVText(str: string): string {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private redirectToLoginPage(): void {
    let logout = location.protocol + '//' + location.host;
    window.location.href = logout;
  }
}

