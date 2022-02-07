import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from 'shared/services/auth-guard.service';
import { NgbdSortableHeader } from 'shared/services/sortable.directive';
import { SharedModule } from 'shared/shared.module';

import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';



@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    NgbdSortableHeader,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'admin/products/new', 
      component: ProductFormComponent, 
      canActivate: [AuthGuardService, AdminAuthGuardService] },
      { path: 'admin/products/:id', 
      component: ProductFormComponent, 
      canActivate: [AuthGuardService, AdminAuthGuardService] },
      { path: 'admin/products', 
      component: AdminProductsComponent, 
      canActivate: [AuthGuardService, AdminAuthGuardService] },
      { path: 'admin/orders', 
      component: AdminOrdersComponent, 
      canActivate: [AuthGuardService, AdminAuthGuardService] }
    ]),
  ],
  providers: [
    AdminAuthGuardService,
    DecimalPipe
  ]
})
export class AdminModule { }

