import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'page-header',
	templateUrl: './page-header.component.html',
	styleUrls: ['./page-header.component.css'],
})
export class PageHeaderComponent implements OnInit {
	@Input('page-name') pageName: string;
	@Input('page-title') pageTitle: string;
	@Input('button-class') buttonClass: string;
	@Input('button-link') buttonLink: string;
	@Input('button-text') buttonText: string;

	constructor() {}

	ngOnInit(): void {}
}
