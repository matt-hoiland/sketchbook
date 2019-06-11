import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SketchListComponent } from './sketch-list/sketch-list.component';
import { SketchViewComponent } from './sketch-view/sketch-view.component';

const routes: Routes = [
  { path: '', component: SketchListComponent },
  { path: 'sketch/:a/:b', component: SketchViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
