import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Event, eventProviderInfo } from '../event';

// Services
import { CategoriesService } from '../categories.service';
import { EventService } from '../event.service';
import { UserDetailsService } from '../user-details.service';
import { userDetailsObj } from '../user-details.service';

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

  name: string;
  img: string;
  lat: number;
  lng: number;
  price: number;
  loc: string;
  date: string;
  categories: Array<string>;
  age_min: number;
  age_max: number;
  provider: eventProviderInfo;
  provider_fname: string;
  provider_lname: string;
  provider_cname: string;
  provider_email: string;
  provider_phoneNum: string;
  available_tickets: number;
  description: string;

  userDetails: userDetailsObj;
  userFirstName: String;
  userLastName: String;

  ngOnInit() {
    this.getEvent();
    this.userDetails = this.userDetailsService.getDetails();
    this.userFirstName = this.userDetails.firstName;
    this.userLastName = this.userDetails.lastName;
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
        this.provider_cname = this.provider.cname;
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
    const id = +this.route.snapshot.paramMap.get('id');
    this.eventService.buyEvent(id)
      .subscribe(data => {
        if (data) {
          console.log(data); 
          alert("Η συναλλαγή ήταν επιτυχής!");
          //pdf creation
          var onoma = this.userFirstName.toString();
          var epitheto = this.userLastName.toString();
          var docDefinition = {
            content: [
              { text: 'Λεωνίδα ένα Άλογο', style: 'header' },
              { text: ' ' },
              { text: ' ' },
              { text: 'Εισιτήριο για την δραστηριότητα', style: ['header', 'centerStyle'] },
              { text: ' ' },
              { text: this.name, style: ['header', 'centerStyle'] },
              { text: ' ' },
              { text: 'Στοιχεία Εισιτηρίου', style: 'leftStyleHeader' },
              { text: ' ' },
              { text: 'Κωδικός εισιτηρίου: '.concat('εδώ να βάλουμε το id του transaction'), style: 'leftStyle' },
              { text: 'Τοποθεσία: '.concat(this.loc), style: 'leftStyle' },
              { text: 'Ημερομηνία: '.concat(this.date), style: 'leftStyle' },
              { text: 'Πάροχος: '.concat(this.provider_cname), style: 'leftStyle' },
              { text: ' '.concat(''), style: 'leftStyle' },
              { text: 'Στοιχεία Κατόχου', style: 'leftStyleHeader' },
              { text: ' '.concat(''), style: 'leftStyle' },
              { text: 'Όνομα: '.concat(onoma), style: 'leftStyle' },
              { text: 'Επώνυμο: '.concat(epitheto), style: 'leftStyle' }
            ],
            styles: {
              header: {
                fontSize: 22,
                bold: true
              },
              centerStyle: {
                italic: true,
                alignment: 'center'
              },
              leftStyleHeader: {
                fontSize: 18,
                italic: true,
                alignment: 'left',
                bold: true
              },
              leftStyle: {
                fontSize: 14,
                italic: true,
                alignment: 'left'
              }
            }
          };
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
          pdfMake.createPdf(docDefinition).download('ticket.pdf');
        }
        else {
          alert("Η συναλλαγή ήταν ανεπιτυχής!")
        }
      });
  }
}


