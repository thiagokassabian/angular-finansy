import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatabase } from '../in-memory-database';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { InterceptorService } from './components/spinner/interceptor.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
	declarations: [SpinnerComponent, NavbarComponent],
	imports: [
		CommonModule,
		RouterModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
	],
	exports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		SpinnerComponent,
		NavbarComponent,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
	],
})
export class CoreModule {}
