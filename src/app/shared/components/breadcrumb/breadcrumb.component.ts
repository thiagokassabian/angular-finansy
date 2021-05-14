import { Component, Input, OnInit } from '@angular/core';

interface BreadcrumbItem {
	text: string;
	link?: string;
}

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
	@Input() items: Array<BreadcrumbItem>;

	constructor() {}

	ngOnInit(): void {}
}
