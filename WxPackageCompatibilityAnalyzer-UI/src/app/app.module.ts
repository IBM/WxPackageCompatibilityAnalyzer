import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AnalyzeCompatabilityComponent } from './analyze-compatability/analyze-compatibility.component';
import { NamespacePipe } from './pipes/namespace';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavigationComponent,
    ConfigurationComponent,
    AnalyzeComponent,
    MessageComponent,  
    AnalyzeCompatabilityComponent,
    NamespacePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
