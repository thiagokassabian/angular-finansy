import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
	selector: 'app-category-form',
	templateUrl: './category-form.component.html',
	styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
	currentAction: string;
	categoryForm: FormGroup;
	pageTitle: string;
	serverErrorMessages: string[] = null;
	submittingForm: boolean = false;
	category: Category = {} as Category;

	constructor(
		private categoryService: CategoryService,
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder
	) {}

	ngOnInit(): void {
		this.setCurrentAction();
		this.buildForm();
		this.loadCategory();
	}

	ngAfterContentChecked(): void {
		this.setPageTitle();
	}

	submitForm = () => {
		this.submittingForm = true;
		if (this.currentAction === 'new') this.createCategory();
		else this.updateCategory();
	};

	private setCurrentAction = () => {
		//console.log(this.route.snapshot.paramMap.get('id'));
		if (this.route.snapshot.url[0].path === 'new') this.currentAction = 'new';
		else this.currentAction = 'edit';
	};

	private buildForm = () => {
		this.categoryForm = this.formBuilder.group({
			id: [null],
			name: [null, [Validators.required, Validators.minLength(3)]],
			description: [null],
		});
	};

	private loadCategory = () => {
		if (this.currentAction === 'edit') {
			this.route.paramMap
				.pipe(
					switchMap((params) => this.categoryService.getById(+params.get('id')))
				)
				.subscribe(
					(response) => {
						this.category = response;
						//this.categoryForm.patchValue(this.category);
						const { id, name, description } = this.category;
						this.categoryForm.patchValue({
							id,
							name,
							description,
						});
						console.log(this.category);
					},
					(error) => alert('Algum erro ocorreu')
				);
		}
	};

	private setPageTitle = () => {
		if (this.currentAction === 'new') this.pageTitle = 'Cadastro de categoria';
		else {
			const categoryName = this.category.name || '';
			this.pageTitle = 'Editando categoria ' + categoryName;
		}
	};

	private createCategory = () => {
		const category: Category = this.categoryForm.value;
		this.categoryService.create(category).subscribe(
			(response) => {
				this.actionsForSuccess(response);
			},
			(error) => {
				this.actionsForErrors(error);
			}
		);
	};

	private updateCategory = () => {
		const category: Category = this.categoryForm.value;
		this.categoryService.update(category).subscribe(
			(response) => {
				this.actionsForSuccess(response);
			},
			(error) => {
				this.actionsForErrors(error);
			}
		);
	};

	private actionsForSuccess = (category: Category) => {
		this.router
			.navigateByUrl('categories', { skipLocationChange: true })
			.then(() => {
				this.router.navigate(['categories', category.id, 'edit']);
			});
	};

	private actionsForErrors = (error) => {
		console.log(error);
		this.submittingForm = false;

		if (error.status === 422)
			this.serverErrorMessages = JSON.parse(error._body).erros;
		else
			this.serverErrorMessages = [
				'Falha na comunicação com o servidor. Tente mais tarde',
			];
	};
}
