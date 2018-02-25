import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Category } from '../category';

// Services
import { CategoriesService } from '../categories.service';
import { EventService } from '../event.service';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css']
})

export class EditActivityComponent implements OnInit {

  @Input() category: Category;

  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private location: Location,
    private mapsAPILoader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.getID();
  }

  getID(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categoriesService.getCategory(id)
      .subscribe(category => this.category = category);
  }

  goBack(): void {
    this.location.back();
  }

}
