export interface Payment{
    email : string,
    phone : string,
    name : string,
    details : string,
    total : number,
    cardRequest : CardPayment
}

export interface CardPayment {
    number : string,
    exp_month : number,
    exp_year : number,
    cvc : number
}