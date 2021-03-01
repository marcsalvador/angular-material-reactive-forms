import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FrontLayoutComponent } from '../front-layout/front-layout.component';
import { Product } from '../payment/cart/cart.component';
import { ItemService } from '../services/api/item.service';
import { StringService } from '../services/library/string.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  filteredProducts: Product[] = [];
  products: Product[] = [];
  measureTypes: any[];
  categoryId = 0;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    @Inject(forwardRef(() => FrontLayoutComponent)) public app: FrontLayoutComponent,
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    public stringService: StringService,
    public spinner: NgxSpinnerService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.app.pageTitle = 'Search and Pay';
    this.activatedRoute.queryParams.subscribe((params) => {
      this.categoryId = +params['id'] || 0;
      this.getProducts();
    });    
  }


  getMeasureTypes() {
    this.itemService.GetMeasureTypes()
      .subscribe((d) => {
        this.measureTypes = d;
      }, (e) => {
      });
  }

  getProducts() {
    this.itemService.GetProducts()
      .subscribe((d) => {
        this.products = d;
        this.filteredProducts = this._filter();
      }, (e) => {

      });
  }

  private _filter(): Product[] {
    if (this.categoryId == 0) return this.products;
    return this.products.filter(option => option.categoryId === this.categoryId);
  }

  gotToCart(value: number) {     
    this.router.navigate(['/'], { queryParams: { id: value } });
  }
}
