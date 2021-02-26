import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { CartComponent } from './payment/cart/cart.component';

const routes: Routes = [
  {
    path: '', component: FrontLayoutComponent, children: [
      { path: '', component: CartComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
