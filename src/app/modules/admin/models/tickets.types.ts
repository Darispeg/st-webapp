export interface Ticket
{
    key? : string,
    type: string,
    price: number,
    aviable: number,
    eventKey: string,
    additionalInformation: AdditionalInformation[]
}

export interface AdditionalInformation
{
    value: string,
    information: string
}