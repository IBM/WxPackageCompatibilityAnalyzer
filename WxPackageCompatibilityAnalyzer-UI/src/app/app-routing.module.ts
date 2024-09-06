import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { AnalyzeCompatabilityComponent } from './analyze-compatability/analyze-compatibility.component';

const routes: Routes = [
  { path: '', component: ConfigurationComponent },
  { path: 'analyze-dependencies', component: AnalyzeComponent},
  { path: 'analyze-compatibility', component: AnalyzeCompatabilityComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
