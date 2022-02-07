import { DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';
import { NgbdSortableHeader, SortEvent } from 'shared/services/sortable.directive';

// import { DataTableParams, DataTableResource } from 'angular-4-data-table';
 

// export let PRODUCTS: Product[] = [new Product('denis')];


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
  providers: [DecimalPipe]
})
export class AdminProductsComponent{
  filteredProducts: any;
  products: Product[] = [];
  // subscription: Subscription;
  // tableResource!: DataTableResource<Product>;
  items!: Product;
  itemCount!: number;

// -----------------------------------------------------------------------------------------
  products$: Observable<Product[]>; 
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
// -----------------------------------------------------------------------------------------


  constructor(public service: ProductService) { 
    service.getAll().snapshotChanges()
      .subscribe(products => {
        let prod = new Product();
        this.filteredProducts = this.products = prod.setProductSnapshotArray(products)
        // PRODUCTS = prod.setProductSnapshotArray(products);
        // this.initializeTable(this.products)
      })

    this.products$ = service.products$;
    this.total$ = service.total$
  }

  // filter(query: string) {
  //   this.filteredProducts = (query) ? 
  //     this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : 
  //     this.products;
  // }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

  

// -----------------------------------------------------------------------------------------
  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
// -----------------------------------------------------------------------------------------









  





  // private initializeTable(products: Product) {
  //   this.tableResource = new DataTableResource(products.productArray);
  //       this.tableResource.query({ offset: 0 })
  //         .then((items: Product[]) => this.items.productArray = items)
  //       this.tableResource.count()
  //         .then((count: number) => this.itemCount = count)
  // }


  // reloadItems(params: DataTableParams) {
  //   if(!this.tableResource) return;

  //   this.tableResource.query(params)
  //         .then((items: Product[]) => this.items.productArray = items)
  // }

 
  
  // log(x: any) { console.log(x); }

}
