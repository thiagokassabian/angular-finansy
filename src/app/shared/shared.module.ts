import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { ServerErrorMessagesComponent } from './components/server-error-messages/server-error-messages.component';

@NgModule({
	declarations: [
		BreadcrumbComponent,
		PageHeaderComponent,
		FormFieldErrorComponent,
		ServerErrorMessagesComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	exports: [
		CommonModule,
		ReactiveFormsModule,

		BreadcrumbComponent,
		PageHeaderComponent,
		FormFieldErrorComponent,
		ServerErrorMessagesComponent,
	],
})
export class SharedModule {}
