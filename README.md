# softeng
Εργασία Τεχνολογίας Λογισμικού 2017-2018

## Team Name: *"Λεωνίδα ένα άλογο"*

# Table Of Contents
- [softeng](#softeng)
    - [Team Name: *"Λεωνίδα ένα άλογο"*](#team-name-%CE%BB%CE%B5%CF%89%CE%BD%CE%AF%CE%B4%CE%B1-%CE%AD%CE%BD%CE%B1-%CE%AC%CE%BB%CE%BF%CE%B3%CE%BF)
- [Table Of Contents](#table-of-contents)
    - [Authors](#authors)
    - [Folder Structure](#folder-structure)
        - [- Architecture](#architecture)
        - [- Business](#business)
        - [- DBSrvc](#dbsrvc)
        - [- Frontend](#frontend)
        - [- Models](#models)
        - [- SockSrvc](#socksrvc)

## Authors
- Dadamis Phivos Asterios       (031 11079) (phivos93@yahoo.com)
- Mperetsos Theodoros           (031 11612) (theo.mper@gmail.com)
- Petropoulos-Trakas Efthymis   (031 11525) (timos@email.com)
- Roditis-Koutsantonis Orestis  (031 11052) (orestarod@gmail.com)
- Smaragdis Dimitrios           (031 11144) (dimitris_sma@hotmail.com)
- Stathopoulou Maria            (031 11904) (maria_6nhrak@hotmail.com)

## Folder Structure
### - Architecture
Διαγράμματα και κείμενα που περιγράφουν την αρχιτεκτονική της εφαρμογής που ακολουθούμε και επιμέρους λεπτομέρειες.
### - Business
Διαγράμματα και κείμενα που περιγράφουν το μοντέλο επιχείρησης που έχουμε επιλέξει και την περιγραφή Business Plan && Business Logic.
### - DBSrvc
Web Service για την επικοινωνία με τη βάση δεδομένων, σε ξεχωριστή υπηρεσία από το web service το οποίο χρησιμοποιεί η εφαρμογή, για θέματα ασφάλειας και scale out.
### - Frontend
Web εφαρμογή, η οποία αποτελεί το κομμάτι της εφαρμογής που βλέπει ο πελάτης / καταναλωτής.
### - Models
Κοινά αρχεία στα οποία δηλώνουμε τη δομή των κλάσεων που χρειαζόμαστε για την εφαρμογή, ώστε να έχουμε καλύτερο συντονισμό και κεντρική διαχείριση των δομών. Επίσης χρησιμοποιούνται για τη δημιουργία της βάσης δεδομένων.
### - SockSrvc
Web Service που υλοποιεί το backend της εφαρμογής και είναι υπεύθυνο για chat, επικοινωνία με τη βάση και διαμοιρασμό στατικών αρχείων (εικόνων κλπ) στο frontend.
