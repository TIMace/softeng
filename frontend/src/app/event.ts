export class Event {
    id: number;
    price: number;
    name: string;
    description: string;
    date: string;
    provider_id: number;
    available_tickets: number;
    lat: number;
    lng: number;
    age_min: number;
    age_max: number;
    location: string; //map_data ths vashs
    is_paid: boolean;
    img: string;
    categories: Array<string>;
    providerInfo:eventProviderInfo;
}

export class eventProviderInfo{
    email:string;
    fname:string;
    lname:string;
    cname:string;
    address:string;
    phoneNum:string;
}
// export class Category {
//     id: number;
//     name: string;
//     description: string;
// }