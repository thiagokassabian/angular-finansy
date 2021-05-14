import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'server-error-messages',
	templateUrl: './server-error-messages.component.html',
	styleUrls: ['./server-error-messages.component.css'],
})
export class ServerErrorMessagesComponent implements OnInit {
	@Input('server-error-messages') serverErrorMessages: string[] = null;

	constructor() {}

	ngOnInit(): void {}
}
