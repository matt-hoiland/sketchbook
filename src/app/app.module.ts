import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SketchViewComponent } from './sketch-view/sketch-view.component';
import { SketchListComponent } from './sketch-list/sketch-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SketchViewComponent,
    SketchListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
