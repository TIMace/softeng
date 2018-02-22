import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Category } from '../category';

// Services
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css']
})
export class CreateActivityComponent implements OnInit {
  @Input() category: Category;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCategory();
  }

  getCategory(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categoriesService.getCategory(id)
      .subscribe(category => this.category = category);
  }

}
