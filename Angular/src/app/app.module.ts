import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayClassesComponent } from './display-classes/display-classes.component';
import { DisplayClassComponent } from './display-class/display-class.component';

import {MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassModalComponent } from './class-modal/class-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayClassesComponent,
    DisplayClassComponent,
    ClassModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    ClassModalComponent,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
