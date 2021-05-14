import { Directive, OnInit } from '@angular/core';
import { BaseResourceModel } from '../models/base-resource.model';
import { BaseResourceService } from '../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel>
	implements OnInit
{
	resources: T[];

	constructor(protected baseResourceService: BaseResourceService<T>) {}

	ngOnInit() {
		this.loadResources();
	}

	protected loadResources() {
		this.baseResourceService.getAll().subscribe(
			(response) => {
				this.resources = response.sort((a, b) => b.id - a.id);
			},
			(error) => console.log('Erro ao carregar a lista', error)
		);
	}

	public deleteResource(id: number) {
		const confirmation = confirm('Tem certeza que deseja excluir?');

		if (confirmation) {
			this.baseResourceService.delete(id).subscribe(
				() => {
					this.resources = this.resources.filter((element) => element.id != id);
				},
				(error) => console.log('Erro ao excluir', error)
			);
		}
	}
}
