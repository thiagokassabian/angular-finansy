import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { BaseResourceFormComponent } from 'src/app/shared/base-resource-form/base-resource-form.component';
import { SpinnerService } from 'src/app/core/components/spinner/spinner.service';

@Component({
	selector: 'app-category-form',
	templateUrl: './category-form.component.html',
	styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {
	constructor(
		public spinnerService: SpinnerService,
		protected categoryService: CategoryService,
		protected injector: Injector
	) {
		super(injector, new Category(), categoryService, Category.newObjFromJson);
	}

	protected buildForm() {
		this.resourceForm = this.formBuilder.group({
			id: [null],
			name: [null, [Validators.required, Validators.minLength(3)]],
			description: [null],
		});
	}

	protected createPageTitle(): string {
		return 'Cadastrar nova categoria';
	}
	protected editPageTitle(): string {
		const resourceName = this.resource.name || undefined;
		return `Edição de categoria ${resourceName}`;
	}
}
