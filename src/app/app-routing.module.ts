import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { CartComponent } from './payment/cart/cart.component';
import { ThankYouComponent } from './payment/thank-you/thank-you.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '', component: FrontLayoutComponent, children: [
      { path: '', component: CartComponent },
      { path: 'thank-you', component: ThankYouComponent },
      { path: 'products', component: ProductsComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
