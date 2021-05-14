import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { EntryService } from '../entry.service';
import { Entry } from '../entry.model';
import { Category } from '../../categories/category.model';
import { CategoryService } from '../../categories/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/base-resource-form/base-resource-form.component';
import { SpinnerService } from 'src/app/core/components/spinner/spinner.service';

@Component({
	selector: 'app-entry-form',
	templateUrl: './entry-form.component.html',
	styleUrls: ['./entry-form.component.css'],
})
export class EntryFormComponent
	extends BaseResourceFormComponent<Entry>
	implements OnInit
{
	categories: Category[];
	isLoading: boolean = true;

	imaskConfig = {
		mask: Number, // enable number mask
		scale: 2, // digits after point, 0 for integers
		signed: false, // disallow negative
		thousandsSeparator: '.', // any single char
		padFractionalZeros: true, // if true, then pads zeros at end to the length of scale
		normalizeZeros: true, // appends or removes zeros at ends
		radix: ',', // fractional delimiter
		mapToRadix: ['.'], // symbols to process as radix
	};

	constructor(
		public spinnerService: SpinnerService,
		protected entryService: EntryService,
		protected categoryService: CategoryService,
		protected injector: Injector
	) {
		super(injector, new Entry(), entryService, Entry.newObjFromJson);
	}

	ngOnInit() {
		this.loadCategories();
		super.ngOnInit();
	}

	get typeOptions(): Array<any> {
		return Object.entries(Entry.types).map(([key, value]) => ({
			key,
			value,
		}));
	}

	protected buildForm = () => {
		this.resourceForm = this.formBuilder.group({
			id: [null],
			name: [null, [Validators.required, Validators.minLength(3)]],
			description: [null],
			type: ['expense', [Validators.required]],
			amount: [null, [Validators.required]],
			date: [null, [Validators.required]],
			paid: [true, [Validators.required]],
			categoryId: [null, [Validators.required]],
		});
	};

	private loadCategories = () => {
		this.categoryService
			.getAll()
			.subscribe((response) => (this.categories = response));
	};

	protected createPageTitle(): string {
		return 'Cadastrar novo lançamento';
	}
	protected editPageTitle(): string {
		const resourceName = this.resource.name || undefined;
		return `Edição de lançamento ${resourceName}`;
	}
}
