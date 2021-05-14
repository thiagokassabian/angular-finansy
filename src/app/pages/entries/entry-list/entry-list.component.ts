import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/core/components/spinner/spinner.service';
import { BaseResourceListComponent } from 'src/app/shared/base-resource-list/base-resource-list.component';
import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css'],
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {
	constructor(
		public spinnerService: SpinnerService,
		protected entryService: EntryService
	) {
		super(entryService);
	}
}
