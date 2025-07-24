import { FC, PropsWithChildren, useContext, useEffect, useState } from "react"
import { authService } from "../services/auth"
import { Paths, PublicRoutes } from "../consts/routes"
import {observer} from 'mobx-react-lite'
import { context } from ".."

export const AuthWrapper: FC<PropsWithChildren> = observer(({children}) => {

    const ctx = useContext(context)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(!ctx.authStore){return}
        const fetcher = async () => {
            try{
                const {token} = await authService.auth()
                if(token){
                    ctx.authStore?.setIsAuth(true)
                    localStorage.setItem('token', token)
                    return
                }

                ctx.authStore?.setIsAuth(false)
                localStorage.removeItem('token')
            }catch(err){

                ctx.authStore?.setIsAuth(false)
                localStorage.removeItem('token')

                if(window.location.pathname === Paths.SignIn){
                    return
                }

                window.location.pathname = Paths.SignIn
            }
        }

        fetcher().finally(() => setIsLoading(false))
    }, [ctx.authStore])


    if(isLoading){
        return null
    }

    if(!ctx.authStore.isAuth){
        return <PublicRoutes />
    }

    return (
        <>
            {children}
        </>
    )
})