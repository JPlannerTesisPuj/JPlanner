import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayClassesComponent } from './display-classes/display-classes.component';
import { DisplayClassComponent } from './display-class/display-class.component';


// Librerías de Angular Material
import {
  MatDialogModule,
  MatTabsModule
 } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClassModalComponent } from './class-modal/class-modal.component';
import { FilterComponent } from './filter/filter.component';

// Librerías necesarias para mostrar el calendario
import { CommonModule, registerLocaleData } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DataService } from './shared/data.service';
import { CalendarComponent, OverlapClassConfirmationDialog } from './calendar/calendar.component';
import localeEs from '@angular/common/locales/es';
import { DisplaySubjectsComponent } from './display-subjects/display-subjects.component';
import { ShoppingCartComponent } from './calendar/menu-tabs/shopping-cart/shopping-cart.component';
import { BlockModalComponent } from './block-modal/block-modal.component';
import { UseGuideComponent } from './use-guide/use-guide.component';
import {SlideshowModule} from 'ng-simple-slideshow';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DisplayClassesComponent,
    DisplayClassComponent,
    ClassModalComponent,
    FilterComponent,
    CalendarComponent,
    OverlapClassConfirmationDialog,
    DisplaySubjectsComponent,
    ShoppingCartComponent,
    BlockModalComponent,
    UseGuideComponent
  ],
  imports: [
    SlideshowModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DragDropModule,
  ],
  entryComponents: [
    ClassModalComponent,
    OverlapClassConfirmationDialog,
    BlockModalComponent,
    UseGuideComponent
  ],

  providers: [
    DataService,
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
