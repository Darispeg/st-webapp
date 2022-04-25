import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { User } from "../models/users.types";
import { environment } from "environments/environment";
import { map, take, tap, switchMap, filter } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class
UsersService
{
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

    private _new:string = '00000000-0000-0000-0000-000000000000';

    constructor(private _httpClient: HttpClient){}

    get users$(): Observable<User[]>
    {
        return this._users.asObservable();
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    getUsers(): Observable<User[]>
    {
        return this._httpClient.get<User[]>(`${environment.APIurl}/users`)
        .pipe(
            tap((users) => {
                console.log(users);
                this._users.next(users);
            })
        );
    }

    getUserByKey(key: string): Observable<User>
    {
        if(key === this._new)
        {
            return this._user.pipe(
                take(1),
                map(() => {
                    const user : User = {
                        key : '',
                        fullname: '',
                        username: '',
                        email: '',
                        password: '',
                        phone: '',
                        status: 'active'
                    };
                    this._user.next(user);
                    return user;
                })
            );
        }

        return this._users.pipe(
            take(1),
            map((Users) => {
                const User = Users.find(item => item['key'] ===  key) || null;
                this._user.next(User);
                return User;
            }),
            switchMap((User) => {
                if ( !User )
                {
                    return throwError(`No se pudo encontrar el proveedor con la clave ${key}!`);
                }
                return of(User);
            })
        );
    }

    createUser(newUser: User): Observable<User>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.post<User>(`${environment.APIurl}/users`, newUser).pipe(
                map((newUser) => {
                    this._users.next([newUser, ...users]);
                    return newUser;
                })
            ))
        )
    }

    updateUser(key: string, _update: User): Observable<User>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.put<User>(`${environment.APIurl}/users/${key}`, _update)
            .pipe(
                map((updateUser) => {
                    const index = users.findIndex(item => item['key'] === key);
                    users[index] = updateUser;
                    this._users.next(users);
                    return updateUser;
                }),
                switchMap(updateUser => this.user$.pipe(
                    take(1),
                    filter(item => item && item['key'] === key),
                    tap(() => {
                        this._user.next(updateUser);
                        return updateUser;
                    })
                ))
            ))
        );
    }

    deleteUser(key: string): Observable<boolean>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.delete(`${environment.APIurl}/users/${key}`)
            .pipe(
                map((isDeleted: boolean) => {
                    const index = users.findIndex(item => item['key'] === key);
                    users.splice(index, 1);
                    this._users.next(users);
                    return isDeleted;
                })
            ))
        )
    }
}
