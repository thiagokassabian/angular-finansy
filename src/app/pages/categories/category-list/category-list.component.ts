import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/core/components/spinner/spinner.service';
import { BaseResourceListComponent } from 'src/app/shared/base-resource-list/base-resource-list.component';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent extends BaseResourceListComponent<Category> {
	constructor(
		public spinnerService: SpinnerService,
		protected categoryService: CategoryService
	) {
		super(categoryService);
	}
}
