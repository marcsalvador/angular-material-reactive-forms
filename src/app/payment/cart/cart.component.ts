import { AfterViewInit, Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { FrontLayoutComponent } from 'src/app/front-layout/front-layout.component';
import { ItemService } from 'src/app/services/api/item.service';
import { PayPalButton, PayPalItem, PaypalService } from 'src/app/services/library/paypal.service';
import { StringService } from 'src/app/services/library/string.service';

export class Product {
  public name: string;
  public itemId: number;
  public measureTypeId: number;
  public unitPrice: number;
  public image: string;
  public description: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit {

  public cartForm!: FormGroup;
  public filteredOptions: Observable<Product[]>;
  products: Product[] = [];
  myControl = new FormControl();

  showQuantity = false;
  measureTypes: any[];
  selectedProduct: Product;
  selectedMeasureTypes: any;

  totalAmount: number;
  showPayButton = false;

  constructor(
    @Inject(forwardRef(() => FrontLayoutComponent)) public app: FrontLayoutComponent,
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    public stringService: StringService,
    public paypalService: PaypalService) {
  }

  ngOnInit(): void {
    this.cartForm = this.formBuilder
      .group(
        {
          itemName: new FormControl('', [Validators.required]),
          itemId: new FormControl('', [Validators.required]),
          quantity: new FormControl('', [Validators.required]),
        },
      );
  }

  ngAfterViewInit(): void {
    this.app.pageTitle = 'Search and Pay';
    this.getProducts();
    this.getMeasureTypes();
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
        this.filteredOptions = this.myControl
          .valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.products)
          );
      }, (e) => {

      });
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private getProductByItemId(itemId: number): Product {
    return this.products.filter(option => option.itemId == itemId)[0];
  }

  setItemId(id: number) {
    const data = this.cartForm.getRawValue();
    data.itemId = id;
    this.cartForm.patchValue(data);

    this.selectedProduct = this.getProductByItemId(id);
    this.selectedMeasureTypes = this.getMeauserTypeByMeasureTypeId(this.selectedProduct.measureTypeId);
    this.showQuantity = true;
    this.totalAmount = 0;
  }

  getMeauserTypeByMeasureTypeId(measureTypeId: number): any {
    return this.measureTypes.filter(option => option.measureTypeId == measureTypeId)[0];
  }

  onQuantityChanged(event: any) {
    setTimeout(() => {
      const data = this.cartForm.getRawValue();
      this.totalAmount = this.selectedProduct.unitPrice + parseFloat(data.quantity);

      // Single Button
      document.getElementById("singleSmartButton").innerHTML = "";
      const item: PayPalItem = {
        description: this.selectedProduct.name,
        unit_amount: this.selectedProduct.unitPrice,
        amount: this.totalAmount,
        quantity: parseFloat(data.quantity)
      };
      const paypalButton: PayPalButton = {
        items: [item],
        id: 'singleSmartButton',
        transactionId: '',
        errorCallback: () => { },
        cancelCallBack: () => { },
        successCallback: () => { },
        clickCallBack: (data: any, item: PayPalButton) => { console.log(data, item); return true; },
        style: null
      };

      this.paypalService.init().subscribe(() => {
        this.paypalService.loadSingleButton(paypalButton);
      }, () => {
  
      });
    }, 100);
  }

  submit() {
    const data = this.cartForm.getRawValue();
    console.log(data);
  }
}
