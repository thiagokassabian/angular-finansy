import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'form-field-error',
	template: `
		<div class="text-danger">
			{{ errorMessage }}
		</div>
	`,
	styleUrls: ['./form-field-error.component.css'],
})
export class FormFieldErrorComponent implements OnInit {
	@Input('form-control') formControl: FormControl;

	constructor() {}

	ngOnInit(): void {}

	public get errorMessage(): string | null {
		if (this.formControl.invalid && this.formControl.touched)
			return this.getErrorMessage();
		else return null;
	}

	private getErrorMessage(): string | null {
		const formControlErrors = this.formControl.errors;

		if (formControlErrors.required) return 'Obrigatório';
		else if (formControlErrors.email) return 'E-mail inválido';
		else if (formControlErrors.minlength) {
			const requiredLength = formControlErrors.minlength.requiredLength;
			return `Mínimo ${requiredLength} caracteres`;
		} else if (formControlErrors.maxlength) {
			const requiredLength = formControlErrors.maxlength.requiredLength;
			return `Máximo ${requiredLength} caracteres`;
		} else return null;
	}
}
