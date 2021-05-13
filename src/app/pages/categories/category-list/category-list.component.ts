import { Component, OnInit } from '@angular/core';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
	categories: Category[] = [];

	constructor(private categoryService: CategoryService) {}

	ngOnInit(): void {
		this.getCategories();
	}

	getCategories = () => {
		this.categoryService.getAll().subscribe(
			(response) => {
				this.categories = response;
			},
			(error) => console.log('Erro ao carregar a lista', error)
		);
	};

	deleteCategory = (id: number) => {
		const confirmation = confirm('Tem certeza que deseja excluir?');

		if (confirmation) {
			this.categoryService.delete(id).subscribe(
				() => {
					this.categories = this.categories.filter(
						(element) => element.id != id
					);
				},
				(error) => console.log('Erro ao excluir categoria', error)
			);
		}
	};
}
