import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DetermineFirstPlayerModule } from './determine-first-player/determine-first-player.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DetermineFirstPlayerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
