import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayClassesComponent } from './display-classes/display-classes.component';
import { DisplayClassComponent } from './display-class/display-class.component';

import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassModalComponent } from './class-modal/class-modal.component';
import { FilterComponent } from './filter/filter.component';

// Libraries needed to display the calendar
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DataService } from './shared/data.service';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayClassesComponent,
    DisplayClassComponent,
    ClassModalComponent,
    FilterComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  entryComponents: [
    ClassModalComponent,
  ],

  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
