import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl  = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private HttpClient: HttpClient) { }

  getproduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.HttpClient.get<Product>(productUrl); 
  }

  getproductListPaginate( thePage: number, 
                          thePageSize: number , 
                          theCategoryId: number): 
                          Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&`
                    + `page=${thePage}&size=${thePageSize}`;

    return this.HttpClient.get<GetResponseProducts>(searchUrl);
  }

  getproductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate( thePage: number, 
                          thePageSize: number , 
                          theKeyword: string): 
                          Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&`
      + `page=${thePage}&size=${thePageSize}`;

    return this.HttpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.HttpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory));
  }




  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.HttpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

}



interface GetResponseProducts {
  _embedded:  {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded:  {
    productCategory: ProductCategory[];
  }
}