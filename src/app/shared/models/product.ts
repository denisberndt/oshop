import { SnapshotAction } from "@angular/fire/compat/database";


export class Product {
    public key: string;
    public title: string;
    public price: number;
    public category: string;
    public imageUrl: string;
    
    constructor(title: string = "", price: number = 0, category: string = "", imageUrl: string = "") {
      this.key = Date.now().toString();
      this.title = title;
      this.price = price;
      this.category = category;
      this.imageUrl = imageUrl;
    }

    public setProductSnapshot(snapshot: SnapshotAction<Product>[]) {
      console.log('denis')
      console.log(snapshot)
      for(let snap of snapshot) {
        
        let val: any = snap.payload.val();
        console.log(val)
        let key: string | null = snap.key;
        if(key == "title") this.title = val;
        else if(key === "price") this.price = val;
        else if(key === "category") this.category = val;
        else if(key === "imageUrl") this.imageUrl = val;
      }
    }
    public setProductSnapshotArray(snapshot: SnapshotAction<unknown>[]): Product[] {
      let productArray = [];
      for(let snap of snapshot) {
        let product: Product = new Product();
        let val: any = snap.payload.val();

        let key: string = '';
        key +=snap.key;
        product.key = key;
        product.title = val.title;
        product.price = val.price;
        product.category = val.category;
        product.imageUrl = val.imageUrl;

        productArray.push(product);
      }
      return productArray;
        
    }

}