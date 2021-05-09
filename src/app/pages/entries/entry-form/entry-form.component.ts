import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../entry.service';
import { Entry } from '../entry.model';

@Component({
	selector: 'app-entry-form',
	templateUrl: './entry-form.component.html',
	styleUrls: ['./entry-form.component.css'],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
	currentAction: string;
	entryForm: FormGroup;
	pageTitle: string;
	serverErrorMessages: string[] = null;
	submittingForm: boolean = false;
	entry: Entry = new Entry();

	imaskConfig = {
		mask: Number, // enable number mask
		scale: 2, // digits after point, 0 for integers
		signed: false, // disallow negative
		thousandsSeparator: '', // any single char
		padFractionalZeros: true, // if true, then pads zeros at end to the length of scale
		normalizeZeros: true, // appends or removes zeros at ends
		radix: ',', // fractional delimiter
		mapToRadix: ['.'], // symbols to process as radix
	};

	pt: any;

	constructor(
		private entryService: EntryService,
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder
	) {}

	ngOnInit(): void {
		this.pt = {
			firstDayOfWeek: 0,
			dayNames: [
				'Domingo',
				'Segunda',
				'Terça',
				'Quarta',
				'Quinta',
				'Sexta',
				'Sábado',
			],
			dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
			dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
			monthNames: [
				'Janeiro',
				'Fevereiro',
				'Março',
				'Abril',
				'Maio',
				'Junho',
				'Julho',
				'Agosto',
				'Setembro',
				'Outubro',
				'Novembro',
				'Dezembro',
			],
			monthNamesShort: [
				'Jan',
				'Fev',
				'Mar',
				'Abr',
				'Mai',
				'Jun',
				'Jul',
				'Ago',
				'Set',
				'Out',
				'Nov',
				'Dez',
			],
			today: 'Hoje',
			clear: 'Limpar',
		};

		this.setCurrentAction();
		this.buildForm();
		this.loadEntry();
	}

	ngAfterContentChecked(): void {
		this.setPageTitle();
	}

	submitForm = () => {
		this.submittingForm = true;
		if (this.currentAction === 'new') this.createEntry();
		else this.updateEntry();
	};

	private setCurrentAction = () => {
		//console.log(this.route.snapshot.paramMap.get('id'));
		if (this.route.snapshot.url[0].path === 'new') this.currentAction = 'new';
		else this.currentAction = 'edit';
	};

	private buildForm = () => {
		this.entryForm = this.formBuilder.group({
			id: [null],
			name: [null, [Validators.required, Validators.minLength(3)]],
			description: [null],
			type: [null, [Validators.required]],
			amount: [null, [Validators.required]],
			date: [null, [Validators.required]],
			paid: [null, [Validators.required]],
			categoryId: [null, [Validators.required]],
		});
	};

	private loadEntry = () => {
		if (this.currentAction === 'edit') {
			this.route.paramMap
				.pipe(
					switchMap((params) => this.entryService.getById(+params.get('id')))
				)
				.subscribe(
					(response) => {
						this.entry = response;
						this.entryForm.patchValue(this.entry);
						//console.log(this.entry);
					},
					(error) => alert('Algum erro ocorreu')
				);
		}
	};

	private setPageTitle = () => {
		if (this.currentAction === 'new') this.pageTitle = 'Cadastro de lançamento';
		else {
			const entryName = this.entry.name || '';
			this.pageTitle = 'Editando lançamento ' + entryName;
		}
	};

	private createEntry = () => {
		const entry: Entry = this.entryForm.value;
		this.entryService.create(entry).subscribe(
			(response) => {
				this.actionsForSuccess(response);
			},
			(error) => {
				this.actionsForErrors(error);
			}
		);
	};

	private updateEntry = () => {
		const entry: Entry = this.entryForm.value;
		this.entryService.update(entry).subscribe(
			(response) => {
				this.actionsForSuccess(response);
			},
			(error) => {
				this.actionsForErrors(error);
			}
		);
	};

	private actionsForSuccess = (entry: Entry) => {
		this.router
			.navigateByUrl('categories', { skipLocationChange: true })
			.then(() => {
				this.router.navigate(['categories', entry.id, 'edit']);
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
