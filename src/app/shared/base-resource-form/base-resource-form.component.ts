import {
	OnInit,
	AfterContentChecked,
	Injector,
	Directive,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResourceModel } from '../models/base-resource.model';
import { BaseResourceService } from '../services/base-resource.service';
import toastr from 'toastr';

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel>
	implements OnInit, AfterContentChecked {
	currentAction: string;
	resourceForm: FormGroup;
	pageTitle: string;
	serverErrorMessages: string[] = null;
	submittingForm: boolean = false;
	protected route: ActivatedRoute;
	protected router: Router;
	protected formBuilder: FormBuilder;

	constructor(
		protected injector: Injector,
		public resource: T,
		protected baseResourceService: BaseResourceService<T>,
		protected jsonDataToResourceFn: (jsonData: any) => T
	) {
		this.route = injector.get(ActivatedRoute);
		this.router = injector.get(Router);
		this.formBuilder = injector.get(FormBuilder);
	}

	ngOnInit(): void {
		this.setCurrentAction();
		this.buildForm();
		this.loadResource();
	}

	ngAfterContentChecked(): void {
		this.setPageTitle();
	}

	submitForm() {
		this.submittingForm = true;
		if (this.currentAction === 'new') this.createResource();
		else this.updateResource();
	}

	protected setCurrentAction() {
		//console.log(this.route.snapshot.paramMap.get('id'));
		if (this.route.snapshot.url[0].path === 'new') this.currentAction = 'new';
		else this.currentAction = 'edit';
	}

	protected loadResource() {
		if (this.currentAction === 'edit') {
			this.route.paramMap
				.pipe(
					switchMap((params) =>
						this.baseResourceService.getById(+params.get('id'))
					)
				)
				.subscribe(
					(response) => {
						this.resource = response;
						this.resourceForm.patchValue(this.resource);
					},
					(error) => this.actionsForErrors(error)
				);
		}
	}

	protected setPageTitle() {
		if (this.currentAction === 'new') this.pageTitle = this.createPageTitle();
		else this.pageTitle = this.editPageTitle();
	}

	protected createPageTitle(): string {
		return 'Novo';
	}
	protected editPageTitle(): string {
		return 'Edição';
	}

	protected createResource() {
		const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
		this.baseResourceService.create(resource).subscribe(
			(response) => {
				this.actionsForSuccess(response);
			},
			(error) => {
				this.actionsForErrors(error);
			}
		);
	}

	protected updateResource() {
		const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
		this.baseResourceService.update(resource).subscribe(
			(response) => {
				this.actionsForSuccess(response);
			},
			(error) => {
				this.actionsForErrors(error);
			}
		);
	}

	private actionsForSuccess(resource: T) {
		toastr.success('Solicitação processada com sucesso');

		const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
		this.router
			.navigateByUrl(baseComponentPath, { skipLocationChange: true })
			.then(() => {
				this.router.navigate([baseComponentPath, resource.id, 'edit']);
			});
	}

	private actionsForErrors(error) {
		console.log(error);
		toastr.error('Erro ao processar solicitação');

		this.submittingForm = false;

		if (error.status === 422)
			this.serverErrorMessages = JSON.parse(error._body).erros;
		else
			this.serverErrorMessages = [
				'Falha na comunicação com o servidor. Tente mais tarde',
			];
	}

	protected abstract buildForm(): void;
}
