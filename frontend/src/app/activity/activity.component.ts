import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Event, eventProviderInfo } from '../event';

// Services
import { CategoriesService } from '../categories.service';
import { EventService } from '../event.service';
import { UserDetailsService } from '../user-details.service';
import { userDetailsObj } from '../user-details.service'

//pdfMake
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  @Input() ev: Event;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private location: Location,
    private mapsAPILoader: MapsAPILoader,
    public userDetailsService: UserDetailsService
  ) { }

  name: String;
  img: String;
  lat: number;
  lng: number;
  price: number;
  loc: String;
  date: String;
  categories: Array<string>;
  age_min: number;
  age_max: number;
  provider: eventProviderInfo;
  provider_fname: String;
  provider_lname: String;
  provider_email: String;
  provider_phoneNum: String;
  available_tickets: number;
  description: String;

  ngOnInit() {
    this.getEvent();
  }

  getEvent(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.eventService.getEventById(id)
      .subscribe((ev: Event) => {
        this.ev = ev;
        console.log(this.ev);
        this.name = this.ev.name;
        this.img = this.ev.img;
        this.lat = this.ev.lat;
        this.lng = this.ev.lng;
        this.price = this.ev.price;
        this.loc = this.ev.location;
        this.date = this.ev.date;
        this.categories = this.ev.categories;
        this.age_min = this.ev.age_min;
        this.age_max = this.ev.age_max;
        this.provider = this.ev.providerInfo;
        this.provider_fname = this.provider.fname;
        this.provider_lname = this.provider.lname;
        this.provider_email = this.provider.email;
        this.provider_phoneNum = this.provider.phoneNum;
        this.available_tickets = this.ev.available_tickets;
        this.description = this.ev.description;

      });
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


