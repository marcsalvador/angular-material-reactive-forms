import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { CartComponent } from './payment/cart/cart.component';
import { ThankYouComponent } from './payment/thank-you/thank-you.component';

const routes: Routes = [
  {
    path: '', component: FrontLayoutComponent, children: [
      { path: '', component: CartComponent },
      { path: 'thank-you', component: ThankYouComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
