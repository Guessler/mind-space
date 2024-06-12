import { makeAutoObservable } from "mobx"

class Auth {
    isAuth: boolean

    constructor() {
        this.isAuth = false
        makeAutoObservable(this)
    }

    setIsAuth(value?: boolean) {
        this.isAuth = value ?? !this.isAuth
    }
}

export const authStore = new Auth()