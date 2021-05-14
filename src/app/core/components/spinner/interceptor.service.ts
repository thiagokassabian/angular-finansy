import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

@Injectable({
	providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
	constructor(public spinnerService: SpinnerService) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		this.spinnerService.isLoading.next(true);

		return next.handle(req).pipe(
			finalize(() => {
				this.spinnerService.isLoading.next(false);
			})
		);
	}
}
