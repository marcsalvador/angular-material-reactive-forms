import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ItemService } from '../services/api/item.service';

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
    private breakpointObserver: BreakpointObserver,
    private itemService: ItemService) {
    this.itemService.GetCategories()
      .subscribe((d) => {
        this.categories = d;
      }, (e) => {

      });
  }

}
