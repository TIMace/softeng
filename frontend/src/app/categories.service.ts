import { Injectable } from '@angular/core';
import { Category } from './category';
import { CATEGORIES } from './mock-categories';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CategoriesService {

  selectedCategories = [];

  constructor() { }
  
  getCategories(): Observable<Category[]> {
    return of(CATEGORIES);
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
