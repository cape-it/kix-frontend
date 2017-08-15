import {
    HttpError,
    LoginResponse,
    UserLogin,
    UserType
    } from '../model';
import { IAuthenticationService } from './IAuthenticationService';
import { IHttpService } from './IHttpService';
import { Request, Response } from 'express';

export class AuthenticationService implements IAuthenticationService {

    private httpService: IHttpService;

    private TOKEN_PREFIX: string = 'Token ';

    public constructor(httpService: IHttpService) {
        this.httpService = httpService;
    }

    public isAuthenticated(req: Request, res: Response, next: () => void): void {
        const authorizationHeader: string = req.headers['authorization'];
        if (!authorizationHeader) {
            res.redirect('/login');
        } else {
            const token = this.getToken(authorizationHeader);
            if (!token) {
                res.redirect('/login');
            } else {
                // TODO validate token?
                next();
            }
        }
    }

    public async login(user: string, password: string, type: UserType): Promise<string> {
        const userLogin = new UserLogin(user, password, type);
        return await this.httpService.post('auth/login', userLogin)
            .then((response: LoginResponse) => {
                return response.token;
            }).catch((error: HttpError) => {
                // TODO: LoggingService log error
                throw error;
            });
    }

    private getToken(authorizationHeader: string): string {
        if (authorizationHeader.startsWith(this.TOKEN_PREFIX)) {
            const token = authorizationHeader.substr(this.TOKEN_PREFIX.length, authorizationHeader.length);
            return token;
        }

        return null;
    }

}
