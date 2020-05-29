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

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0; 
 
  previousKeyword: string = null;


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
    
     if (this.previousKeyword != theKeyword) {
       this.thePageNumber = 1;

     } 

     this.previousKeyword = theKeyword;

    // search products from keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1 ,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());

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
      // check if we have a diferent category than previous 
      // Note: Angular will reuse a component if it is currently being viewed
      
  
      // diferent category
      if (this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;

    //  console.log(`currentCategory=${this.currentCategoryId}` 
    //          + `pagenumber= ${this.thePageNumber}` 
    //          + ` previousCategory=${this.previousCategoryId}`);

      //now get product from category id
      


      this.productService.getproductListPaginate( this.thePageNumber - 1,
                                                  this.thePageSize , 
                                                  this.currentCategoryId)
                                                  .subscribe(this.processResult());
  }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
 
  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

}
