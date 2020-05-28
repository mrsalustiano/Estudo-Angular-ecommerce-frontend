import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;


  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
      this.handleSearchProducts();

    } else {
      this.handleListProducts();
    }
      
  }
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword'); 
    // search products from keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );

  }

  handleListProducts() {

      // check if "id" paramenters is avaliable
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
  
      if (hasCategoryId){
        //get the "id"  param string. convert to number using "+" symbol
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
  
       
      } else {
        // if the "id" not avaliable , set default category to 1
        this.currentCategoryId = 1;
       
      } 
  
      //now get product from category id
  
      this.productService.getproductList(this.currentCategoryId).subscribe(
        data => {
          this.products  =data;
        }
  
      )

  }
}
