import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [AppComponent],
	imports: [CoreModule, AppRoutingModule, TranslateModule.forRoot()],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
