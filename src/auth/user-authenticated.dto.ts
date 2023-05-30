export default class UserAuthenticatedDto {
    user: {
    username: string,
        password: string,
        id: string
    }
    access_token: string
}