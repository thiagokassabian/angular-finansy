import { Component, OnInit } from '@angular/core';
import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css'],
})
export class EntryListComponent implements OnInit {
	entries: Entry[] = [];

	constructor(private entryService: EntryService) {}

	ngOnInit(): void {
		this.getEntries();
	}

	getEntries = () => {
		this.entryService.getAll().subscribe(
			(response) => {
				this.entries = response;
			},
			(error) => console.log('Erro ao carregar a lista', error)
		);
	};

	deleteEntry = (id: number) => {
		const confirmation = confirm('Tem certeza que deseja excluir?');

		if (confirmation) {
			this.entryService.delete(id).subscribe(
				() => {
					this.entries = this.entries.filter((element) => element.id != id);
				},
				(error) => console.log('Erro ao excluir categoria', error)
			);
		}
	};
}
