import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ItemService } from '../services/api/item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-layout',
  templateUrl: './front-layout.component.html',
  styleUrls: ['./front-layout.component.scss']
})
export class FrontLayoutComponent {

  pageTitle = 'Demo';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  categories: any[];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private itemService: ItemService) {
    this.itemService.GetCategories()
      .subscribe((d) => {
        this.categories = d;
      }, (e) => {

      });
  }

  showItems(categoryId: number) {     
    this.router.navigate(['/products/'], { queryParams: { id: categoryId } });
  }

}
