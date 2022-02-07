import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Product } from 'shared/models/product';
import { CategoryService } from 'shared/services/category.service';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$: any;
  product: Product= new Product();
  id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService, 
    private productService: ProductService) {
      categoryService.getAll().snapshotChanges().subscribe(res => this.categories$ = res);

      this.id = this.route.snapshot.paramMap.get('id');
      if(this.id) {
        // productService.get(this.id).pipe(take(1)).subscribe(p => {
        //   this.product = p
        console.log('denis   ' + this.id)
        productService.get(this.id).snapshotChanges().pipe(take(1)).subscribe(p => {
          console.log('next 1    ')
          console.log(p)
          this.product.setProductSnapshot(p)


            // for(let c of p) {
            //   let val: any = c.payload.val();
            //   let key: string = "";
            //   key += c.key;
            //   if(key == "title") this.product.title = val;
            //   else if(key === "price") this.product.price = val;
            //   else if(key === "category") this.product.category = val;
            //   else if(key === "imageUrl") this.product.imageUrl = val;
            // }
          })
      }

   }

  ngOnInit(): void {
  }

  save(product: any) {
    if (this.id) this.productService.update(this.id, product);
    else this.productService.create(product);

    this.router.navigate(['/admin/products'])
  }

  delete() {
    if(confirm('Are you sure you want to delete this product?')){
      this.productService.delete(this.id);
      this.router.navigate(['/admin/products'])
    }
  }

}
