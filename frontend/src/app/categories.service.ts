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
    ).map((response: Response) => <Category[]>(response.json()))
    return of(CATEGORIES);
    // return req;
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
