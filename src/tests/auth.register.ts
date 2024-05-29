import { IAuthManager } from "../interfaces/auth";
import jest from 'jest'

const EMAIL_ERROR = "INCORRECT_EMAIL"
const PASS_ERROR = "INCORRECT_PASSWORD"

export const register = async (mg: IAuthManager) => {
    const testUser1 = {
        name: "Test",
        email: "Test",
        password: "Test"
    }
    // console.log('register test started')

    // try {
    //     const result = await mg.regiter(testUser1.name, testUser1.email, testUser1.password);
    //     if (result) {
    //         console.log(`- email: validation email is correct`);
    //     } else {
    //         console.error(`- email: validation email is wrong`);
    //     }
    // } catch (err) {
    //     console.log('err', err)
    //     const { message } = err as Error;

    //     if (message !== "INCORRECT_EMAIL" && message !== "EMAIL_ERROR") {
    //         console.error(`- email: validation email is wrong`);
    //     } else {
    //         console.log(`- email: validation email is correct`);
    //     }
    //     return
    // } finally {
    //     console.log('register test finished');
    // }

}