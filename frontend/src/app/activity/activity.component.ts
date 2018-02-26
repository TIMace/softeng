import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Location } from '@angular/common';
import { Category } from '../category';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { Event, eventProviderInfo } from '../event';

//pdfMake
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Services
import { CategoriesService } from '../categories.service';
import { UserDetailsService } from '../user-details.service';
import { userDetailsObj } from '../user-details.service';   
import { EventService } from '../event.service';


// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  @Input() category: Category;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private location: Location,
    private mapsAPILoader: MapsAPILoader,
    public userDetailsService: UserDetailsService,
    private eventService: EventService,
    // private eventDetails: Event
  ) { }

  userDetails = this.userDetailsService.getDetails();
  eventDetails :any = new Event() ;
  zaxos : string;
  
  ngOnInit() {
    this.getCategory();
   // Sto enentId[2] pairnoume to id tou event apo to path url
    var path = this.location.path();
    var eventId = path.split("/", 3);

    this.eventService.getEventById(eventId[2]).subscribe(
      data => {
        console.log(data); 
        this.eventDetails = data;
        this.zaxos = this.eventDetails.categories;
        console.log(this.zaxos);
      }
    )
  }
  getCategory(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categoriesService.getCategory(id)
      .subscribe(category => this.category = category);
  }

  goBack(): void {
    this.location.back();
  }

  onTicketBuy() {
    //elegxos an o parent exei arketa credit tote, xrewse ton, typvse minima success kai typwse pdf
    alert("Η συναλλαγή ήταν επιτυχής!");
    var dd = { content: 'Oresti modelo.' };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd).download();

    //an den exei arketa lefta tote 
    //alert("Η συναλλαγή ήταν ανεπιτυχής!")
  }


}
