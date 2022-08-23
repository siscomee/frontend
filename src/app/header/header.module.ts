import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HeaderComponent, MenuComponent],
  imports: [CommonModule, NgbModule, RouterModule, SharedModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
