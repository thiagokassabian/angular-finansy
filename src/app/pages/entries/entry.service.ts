import { Injectable } from '@angular/core';
import { Entry } from './entry.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class EntryService {
	private apiPath: string = 'api/entries';

	constructor(private http: HttpClient) {}

	getAll = (): Observable<Entry[]> => {
		return this.http
			.get(this.apiPath)
			.pipe(catchError(this.handleError), map(this.jsonDataToEntries));
	};

	getById = (id: number): Observable<Entry> => {
		const url = `${this.apiPath}/${id}`;

		return this.http
			.get<Entry>(url)
			.pipe(catchError(this.handleError), map(this.jsonDataToEntry));
	};

	create = (entry: Entry): Observable<Entry> => {
		return this.http
			.post<Entry>(this.apiPath, entry)
			.pipe(catchError(this.handleError), map(this.jsonDataToEntry));
	};

	update = (entry: Entry): Observable<Entry> => {
		const url = `${this.apiPath}/${entry.id}`;

		return this.http.put<Entry>(url, entry).pipe(
			catchError(this.handleError),
			map(() => entry)
		);
	};

	delete = (id: number): Observable<any> => {
		const url = `${this.apiPath}/${id}`;

		return this.http.delete(url).pipe(
			catchError(this.handleError),
			map(() => null)
		);
	};

	private jsonDataToEntries = (jsonData: any[]): Entry[] => {
		const entries: Entry[] = [];

		jsonData.forEach((element) => {
			const entry = Object.assign(new Entry(), element);
			entries.push(entry);
		});
		//jsonData.forEach((element) => entries.push(element as Entry));
		return entries;
	};

	private jsonDataToEntry = (jsonData: any): Entry => {
		return jsonData as Entry;
	};

	private handleError = (error: any): Observable<any> => {
		console.log(`ERROR: ${error}`);
		return throwError(error);
	};
}
