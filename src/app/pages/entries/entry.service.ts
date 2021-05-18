import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { CategoryService } from '../categories/category.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as moment from 'moment';

@Injectable({
	providedIn: 'root',
})
export class EntryService extends BaseResourceService<Entry> {
	constructor(
		protected injector: Injector,
		private categoryService: CategoryService
	) {
		super('api/entries', injector, Entry.newObjFromJson);
	}

	create(entry: Entry): Observable<Entry> {
		return this.setCategoryAndSendToServer(entry, super.create.bind(this));
	}

	update(entry: Entry): Observable<Entry> {
		return this.setCategoryAndSendToServer(entry, super.update.bind(this));
	}
	getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
		return this.getAll().pipe(
			map((entries) => this.filterByMonthAndYear(entries, month, year))
		);
	}

	private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
		return entries.filter((entry) => {
			const entryDate = moment(entry.date, 'DD/MM/YYYY');
			const monthMatch = entryDate.month() + 1 === +month;
			const yearMatch = entryDate.year() === +year;

			if (monthMatch && yearMatch) return entry;
		});
	}

	private setCategoryAndSendToServer(
		entry: Entry,
		sendFn: any
	): Observable<any> {
		return this.categoryService.getById(entry.categoryId).pipe(
			mergeMap((category) => {
				entry.category = category;
				return sendFn(entry);
			}),
			catchError(this.handleError)
		);
	}
}
