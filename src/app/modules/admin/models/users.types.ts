export interface User
{
    key?: string,
    fullname: string,
    username: string,
    email: string,
    password?: string,
    phone: string,
    createdDate?: Date,
    lastModifiedDate?: Date,
    status: String
}
