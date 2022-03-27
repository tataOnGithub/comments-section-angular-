import { default as data } from "../../assets/data.json"

export class UsersService {
    getUsers() {
        return new Promise((resolve, reject) => {
            return resolve(data);
        })
        // return data;
    }
}