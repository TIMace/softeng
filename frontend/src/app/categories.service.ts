import { Injectable } from '@angular/core';
import { Category } from './category';
import { CATEGORIES } from './mock-categories';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {server_addr} from './server_addr'
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http'; 

@Injectable()
export class CategoriesService {

  selectedCategories = [];

  constructor(private httpClient:HttpClient) { }
  
  getCategories(): Observable<Category[]> {
    var req = this.httpClient.get(
      `${server_addr}/category`
    )
    .map(response => this.server2local_cat(response))
    // req.subscribe((data) => {console.log("Now comes the server answer");console.log(data)});
    // of(CATEGORIES).subscribe((data) => {console.log("Now comes the mock answer");console.log(data)});
    // return of(CATEGORIES);
    return req;
  }

  server2local_cat(server_cats:any): (Category[]) {
    var num = server_cats.length
    var res = [];
    for(var i=0;i<num;i++){
      var elem:Category = new Category();
      elem.id = server_cats[i].category_id;
      elem.name = server_cats[i].category_name;
      elem.description = server_cats[i].category_descr
      res.push(elem);
    }
    // console.log(" Here is what map gets")
    // console.log(res)
    return res;
  }

  getSelectedCategories(): Category[] {
    return this.selectedCategories;
  }

  getCategory(id: number): Observable<Category> {
    return of(CATEGORIES.find(category => category.id === id));
  }

  removeCategory(index: number): void {
    this.selectedCategories.splice(index, 1);
  }

  // NavBar Simple / Extended

  navbar_extended = 0;

  getNavbar(): number {
    return this.navbar_extended;
  }

}
