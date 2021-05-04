import { Injectable } from '@angular/core';
import { Category } from './category';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	private apiPath: string = 'api/categories';

	constructor(private http: HttpClient) {}

	getAll = (): Observable<Category[]> => {
		return this.http
			.get(this.apiPath)
			.pipe(catchError(this.handleError), map(this.jsonDataToCategories));
	};

	getById = (id: number): Observable<Category> => {
		const url = `${this.apiPath}/${id}`;

		return this.http
			.get<Category>(url)
			.pipe(catchError(this.handleError), map(this.jsonDataToCategory));
	};

	create = (category: Category): Observable<Category> => {
		return this.http
			.post<Category>(this.apiPath, category)
			.pipe(catchError(this.handleError), map(this.jsonDataToCategory));
	};

	update = (category: Category): Observable<Category> => {
		const url = `${this.apiPath}/${category.id}`;

		return this.http.put<Category>(url, category).pipe(
			catchError(this.handleError),
			map(() => category)
		);
	};

	delete = (id: number): Observable<any> => {
		const url = `${this.apiPath}/${id}`;

		return this.http.delete(url).pipe(
			catchError(this.handleError),
			map(() => null)
		);
	};

	private jsonDataToCategories = (jsonData: any[]): Category[] => {
		const categories: Category[] = [];
		jsonData.forEach((element) => categories.push(element as Category));
		return categories;
	};

	private jsonDataToCategory = (jsonData: any): Category => {
		return jsonData as Category;
	};

	private handleError = (error: any): Observable<any> => {
		console.log(`ERROR: ${error}`);
		return throwError(error);
	};
}
