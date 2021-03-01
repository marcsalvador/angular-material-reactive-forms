import { AfterViewInit, Component, ElementRef, forwardRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FrontLayoutComponent } from 'src/app/front-layout/front-layout.component';
import { ItemService } from 'src/app/services/api/item.service';
import { PayPalButton, PayPalItem, PaypalService } from 'src/app/services/library/paypal.service';
import { StringService } from 'src/app/services/library/string.service';
import { MapsAPILoader } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

// eslint-disable-next-line no-unused-vars
declare const google: any;

export class Product {
  public name: string;
  public productId: number;
  public measureTypeId: number;
  public unitPrice: number;
  public image: string;
  public description: string;
  public categoryId: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit {

  public cartForm!: FormGroup;
  public filteredOptions: Product[];
  products: Product[] = [];
  myControl = new FormControl();

  showQuantity = false;
  measureTypes: any[];
  selectedProduct: Product;
  selectedMeasureTypes: any;

  totalAmount: number;
  showPayButton = false;

  @ViewChild("txtQuantity") txtQuantity: HTMLInputElement;

  showDelivery = false;
  isChangeAddressMode = false;
  @ViewChild('searchAddress')
  searchElementRef!: ElementRef;

  showCustomer = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    @Inject(forwardRef(() => FrontLayoutComponent)) public app: FrontLayoutComponent,
    public formBuilder: FormBuilder,
    public mapsAPILoader: MapsAPILoader,
    public itemService: ItemService,
    public stringService: StringService,
    public spinner: NgxSpinnerService,
    public paypalService: PaypalService) {

  }

  ngOnInit(): void {
    this.cartForm = this.formBuilder
      .group(
        {
          itemName: new FormControl('', [Validators.required]),
          customerName: new FormControl('', [Validators.required]),
          mobileNumber: new FormControl('', [Validators.required]),
          productId: new FormControl('', [Validators.required]),
          unitPrice: new FormControl('', [Validators.required]),
          quantity: new FormControl('', [Validators.required]),
          totalPrice: new FormControl(''),
          deliveryMethod: new FormControl('', [Validators.required]),
          address: new FormControl('', [Validators.required]),
        },
      );
      
    this.getMeasureTypes();
  }

  ngAfterViewInit(): void {
    this.app.pageTitle = 'Search and Pay';  
  }

  getMeasureTypes() {
    this.itemService.GetMeasureTypes()
      .subscribe((d) => {
        this.measureTypes = d;  
        this.getProducts();
      }, (e) => {
      });
  }

  getProducts() {
    this.itemService.GetProducts()
      .subscribe((d) => {
        this.products = d; 
        this.activatedRoute.queryParams.subscribe((params) => {
          this.setproductId(+params['id'])
        });    
        this.myControl.valueChanges.subscribe(value => {
          if (value.length >= 1) {
            this.itemService.GetProducts().subscribe(response => {
              this.products = response;
              this.filteredOptions = this._filter(value);
            });
          }
          else {
            this.filteredOptions = [];
          }
        })
      }, (e) => {

      });
  }

  displayFn(user: Product): string {
    return user ? user.name : '';
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private getProductByproductId(productId: number): Product {
    return this.products.filter(option => option.productId == productId)[0];
  }

  setproductId(id: number) {
    const data = this.cartForm.getRawValue();
    data.productId = id;
    data.quantity = '';
    this.cartForm.patchValue(data);

    this.selectedProduct = this.getProductByproductId(id);
    this.selectedMeasureTypes = this.getMeauserTypeByMeasureTypeId(this.selectedProduct.measureTypeId);
    this.showQuantity = true;
    this.totalAmount = 0;
    setTimeout(() => {
      document.getElementById("txtQuantity").focus();
    }, 200);
  }

  getMeauserTypeByMeasureTypeId(measureTypeId: number): any {
    return this.measureTypes.filter(option => option.measureTypeId == measureTypeId)[0];
  }

  onQuantityChanged(event: any) {
    setTimeout(() => {
      const data = this.cartForm.getRawValue();
      this.totalAmount = this.selectedProduct.unitPrice + parseFloat(data.quantity);
      data.totalPrice = this.totalAmount;
      this.cartForm.patchValue(data);
      this.showDelivery = true;
      setTimeout(() => {
        document.getElementById("txtDeliveryType").focus();
      }, 100);
    }, 100);
  }

  onDeliveryMethodChanged() {
    setTimeout(() => {
      this.showCustomer = true;
      const data = this.cartForm.getRawValue();
      if (data.deliveryMethod == "Delivery") {
        this.isChangeAddressMode = true;
        setTimeout(() => {
          document.getElementById("searchAddress").focus();
        }, 100);
        this.showPayPal();
        // this.mapsAPILoader.load().then(() => {
        //   const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        //   autocomplete.addListener('place_changed', () => {
        //     const place = autocomplete.getPlace();
        //     data.address = place.formatted_address;
        //     this.cartForm.patchValue(data);
        //     if (this.stringService.IsNotEmpty(data.address)) {
        //       this.showPayPal();
        //     }
        //   });
        // });
      }
      else{
        this.isChangeAddressMode = false;
        setTimeout(() => {
          document.getElementById("customerName").focus();
          this.showPayPal();
        }, 100);
      }
    }, 300);
  }

  submit() {
  }

  showPayPal() {
    // Single Button
    const data = this.cartForm.getRawValue();
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
      errorCallback: (e) => {
        console.log(e);
      },
      cancelCallBack: (e) => {
        console.log(e);
      },
      successCallback: (onlineTransactionId: string) => {
        this.router.navigate(['thank-you']);
      },
      clickCallBack: (data: any, item: PayPalButton) => {
        const formData = this.cartForm.getRawValue();
        if (formData == null) {
          alert("Please fill-up required fields.");
          return false;
        }
        if (formData.invalid) {
          alert("Please fill-up required fields.");
          return false;
        }
        return true;
      },
      style: null
    };
    this.paypalService.init().subscribe(() => {
      this.paypalService.loadSingleButton(paypalButton);
    }, () => {

    });
  }
}
