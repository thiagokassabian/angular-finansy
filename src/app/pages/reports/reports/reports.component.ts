import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from 'src/app/core/components/spinner/spinner.service';
import { Category } from '../../categories/category.model';
import { CategoryService } from '../../categories/category.service';
import { Entry } from '../../entries/entry.model';
import { EntryService } from '../../entries/entry.service';

@Component({
	selector: 'reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
	@ViewChild('month') month: ElementRef;
	@ViewChild('year') year: ElementRef;

	meses: Array<any> = [
		{ key: 1, value: 'Janeiro' },
		{ key: 2, value: 'Fevereiro' },
		{ key: 3, value: 'Março' },
		{ key: 4, value: 'Abril' },
		{ key: 5, value: 'Maio' },
		{ key: 6, value: 'Junho' },
		{ key: 7, value: 'Julho' },
		{ key: 8, value: 'Agosto' },
		{ key: 9, value: 'Setembro' },
		{ key: 10, value: 'Outubro' },
		{ key: 11, value: 'Novembro' },
		{ key: 12, value: 'Dezembro' },
	];
	anos: Array<any> = [
		{ key: 2021, value: '2021' },
		{ key: 2020, value: '2020' },
		{ key: 2019, value: '2019' },
		{ key: 2018, value: '2018' },
		{ key: 2017, value: '2017' },
	];

	expenseTotal: number = 0;
	revenueTotal: number = 0;
	balance: number = 0;

	expenseChartData: any;
	revenueChartData: any;

	// chartOptions: {
	// 	scales: {
	// 		y: {
	// 			beginAtZero: true;
	// 		};
	// 	};
	// };
	chartOptions = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	};

	categories: Category[] = [];
	entries: Entry[] = [];

	constructor(
		public spinnerService: SpinnerService,
		private entryService: EntryService,
		private categoryService: CategoryService
	) {}

	ngOnInit(): void {
		this.categoryService.getAll().subscribe((response) => {
			this.categories = response;
		});
		// this.entryService.getAll().subscribe((response) => {
		// 	this.entries = response;
		// });
	}

	generateReports() {
		const month = this.month.nativeElement.value;
		const year = this.year.nativeElement.value;

		if (!month || !year) alert('Selecionar mês e ano');
		else
			this.entryService.getByMonthAndYear(month, year).subscribe((response) => {
				this.setValues(response);
			});
	}

	private setValues(entries: Entry[]) {
		this.entries = entries;
		this.calculateBalance();
		this.setChartData();
	}

	private calculateBalance() {
		let expenseTotal = 0;
		let revenueTotal = 0;

		this.entries.forEach((entry) => {
			entry.amount = entry.amount.replace('.', '').replace(',', '.');
			if (entry.type === 'expense') expenseTotal += +entry.amount;
			else revenueTotal += +entry.amount;
		});

		this.expenseTotal = expenseTotal;
		this.revenueTotal = revenueTotal;
		this.balance = this.revenueTotal - this.expenseTotal;
	}

	private setChartData() {
		this.revenueChartData = this.getChartData(
			'revenue',
			'Gráfico de Receitas',
			'#9CCC65'
		);
		this.expenseChartData = this.getChartData(
			'expense',
			'Gráfico de Despesas',
			'#e03131'
		);
		console.log(this.revenueChartData);
		console.log(this.expenseChartData);
		console.log(this.chartOptions);
	}

	private getChartData(entryType: string, title: string, color: string) {
		const chartData = [];

		this.categories.forEach((category) => {
			// filtering entries by category and type
			const filteredEntries = this.entries.filter(
				(entry) => entry.categoryId == category.id && entry.type == entryType
			);

			// if found entries, then sum entries amount and add to chartData
			if (filteredEntries.length > 0) {
				const totalAmount = filteredEntries.reduce(
					(total, entry) =>
						total + +entry.amount.replace('.', '').replace(',', '.'),
					0
				);

				chartData.push({
					categoryName: category.name,
					totalAmount: totalAmount,
				});
			}
		});

		return {
			labels: chartData.map((item) => item.categoryName),
			datasets: [
				{
					label: title,
					backgroundColor: color,
					data: chartData.map((item) => item.totalAmount),
				},
			],
		};
	}

	// private setChartData() {
	// 	this.revenueChartData = this.getChartData(
	// 		'revenue',
	// 		'Gráfico de Receitas',
	// 		'#9CCC65'
	// 	);
	// 	this.revenueChartData = this.getChartData(
	// 		'expense',
	// 		'Gráfico de Despesas',
	// 		'#e03131'
	// 	);
	// 	console.log(this.revenueChartData);
	// 	console.log(this.expenseChartData);
	// 	console.log(this.chartOptions);
	// }

	// private getChartData(entryType: string, title: string, color: string) {
	// 	const chartData = [];
	// 	this.categories.forEach((category) => {
	// 		const filteredEntries = this.entries.filter(
	// 			(entry) => entry.categoryId === category.id && entry.type === entryType
	// 		);

	// 		if (filteredEntries.length > 0) {
	// 			const totalAmount = filteredEntries.reduce(
	// 				(total, entry) =>
	// 					total + +entry.amount.replace('.', '').replace(',', '.'),
	// 				0
	// 			);

	// 			chartData.push({
	// 				categoryName: category.name,
	// 				totalAmount: totalAmount,
	// 			});
	// 		}
	// 	});

	// 	return {
	// 		labels: chartData.map((item) => item.categoryName),
	// 		datasets: [
	// 			{
	// 				label: title,
	// 				backgroundColor: color,
	// 				data: chartData.map((item) => item.totalAmount),
	// 			},
	// 		],
	// 	};
	// }
}
