import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Product } from 'shared/models/product';

import { SortColumn, SortDirection } from './sortable.directive';




interface SearchResult {
  products: Product[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(products: Product[], column: SortColumn, direction: string): Product[] {
  if (direction === '' || column === '') {
    return products;
  } else {
    return [...products].sort((a: any, b: any) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(product: Product, term: string, pipe: PipeTransform) {
  return product.title.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(product.price).includes(term);
}





@Injectable()
export class ProductService {
  PRODUCTS: Product[] = [];

  constructor(private pipe: DecimalPipe, private db: AngularFireDatabase) {
    this.db.list('/products').snapshotChanges()
      .subscribe(products => {
        let prod = new Product();
        // this.filteredProducts = this.products = prod.setProductSnapshotArray(products)
        this.PRODUCTS = prod.setProductSnapshotArray(products);
        // this.initializeTable(this.products)
      })

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(500),
      
      switchMap(() => this._search()),
      delay(500),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._products$.next(result.products);
      this._total$.next(result.total);
    });

    this._search$.next();

  }

  
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _products$ = new BehaviorSubject<Product[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };


  get products$() { return this._products$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let products = sort(this.PRODUCTS, sortColumn, sortDirection);

    // 2. filter
    products = products.filter(product => matches(product, searchTerm, this.pipe));
    const total = products.length;

    // 3. paginate
    products = products.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({products: products, total});
  }


  create(product: Product) {
    return this.db.list('/products').push(product);
  }

  getAll(): AngularFireList<Product>{
    // let product: Product[] = [];
    // this.db.list('/products').snapshotChanges()
    // .subscribe((products: any) => {
    //   let prod = new Product();
    //   product = prod.setProductSnapshotArray(products)
    // });
    // return product;
    
    return this.db.list('/products');
  }

  get(productId: string): AngularFireList<Product> {
    return this.db.list('/products/' + productId);
  }

  update(productId: string, product: Product){
    return this.db.object('/products/' + productId).update(product);

  }
  delete(productId: string) {
    return this.db.object('/products/' + productId).remove();
  }



  
  // create(product: Product) {
  //   return this.client.post(this.firebaseDB + '/products' + '.json', product);
  // }

  // getAll(){
  //   console.log('denis 2')
  //   return this.client.get(this.firebaseDB + '/products' + '.json');
  // }

  // get(productId: string){
  //   return this.client.get(this.firebaseDB + '/products/' + productId + '.json');
  // }

  // update(productId: string, product: Product){
  //   return this.client.put(this.firebaseDB + '/products/' + productId + '.json', product);

  // }
  // delete(productId: string) {
  //   return this.client.delete(this.firebaseDB + '/products/' + productId + '.json');
  // }

}
