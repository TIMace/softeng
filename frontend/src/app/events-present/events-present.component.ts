import { Component, OnInit } from '@angular/core';
import { Event, eventProviderInfo } from '../event';

//pdfMake
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Services
import { EventService } from '../event.service';
import { UserDetailsService } from '../user-details.service';
import { userDetailsObj } from '../user-details.service';

// MAP
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-events-present',
  templateUrl: './events-present.component.html',
  styleUrls: ['./events-present.component.css']
})
export class EventsPresentComponent implements OnInit {

  arrayOfEvents: Array<Event>;

  constructor(
    private eventService: EventService,
    private mapsAPILoader: MapsAPILoader,
    public userDetailsService: UserDetailsService
  ) { }

  bringUserEvent() {
    if (this.userDetailsService.getUserType() === 'Parent') {
      this.eventService.getActiveUserEvents().subscribe(
        (data:any) => {
          this.arrayOfEvents = data;
        }
      )
    }
    else if (this.userDetailsService.getUserType() === 'Provider') {
      this.eventService.getActiveProviderEvents().subscribe(
        (data:any) => {
          this.arrayOfEvents = data;
        }
      )
    }
  }

  ngOnInit() {
    this.bringUserEvent();
    this.userDetails = this.userDetailsService.getDetails();
    this.userFirstName = this.userDetails.firstName;
    this.userLastName = this.userDetails.lastName;
  }

  userDetails: userDetailsObj;
  userFirstName: String;
  userLastName: String;

  onClickPdf(eventId) {
    this.eventService.parentGetEventTickets(eventId)
      .subscribe(tickets => {
        console.log(tickets);
        this.eventService.getEventById(eventId)
          .subscribe((eventdata : Event) => {
            console.log(eventdata);
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
                { text: eventdata.name, style: ['header', 'centerStyle'] },
                { text: ' ' },
                { text: 'Στοιχεία Εισιτηρίου', style: 'leftStyleHeader' },
                { text: ' ' },
                { text: 'Κωδικός εισιτηρίου: '.concat(tickets.toString()), style: 'leftStyle' },
                { text: 'Τοποθεσία: '.concat(eventdata.location), style: 'leftStyle' },
                { text: 'Ημερομηνία: '.concat(this.eventService.humanReadableDatetime(eventdata.date)), style: 'leftStyle' },
                { text: 'Πάροχος: '.concat(eventdata.providerInfo.cname
                                          + ' ' + eventdata.providerInfo.email
                                          + ' ' + eventdata.providerInfo.phoneNum), style: 'leftStyle' },
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
          });
      });
  }
}