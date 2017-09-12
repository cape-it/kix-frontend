import { UserType } from '../../../model/client/';
import { SocketEvent } from '../../../model/client/socket/SocketEvent';
import { LOGIN_ERROR } from '../store/actions';
import { AuthenticationEvent, AuthenticationResult, LoginRequest } from '../../../model/client/socket/login';
import { LocalStorageHandler } from '../../../model/client/LocalStorageHandler';
import { SocketListener } from '../../../model/client/socket/SocketListener';

declare var io: any;

export class LoginSocketListener extends SocketListener {

    private socket: SocketIO.Server;
    private store: any;

    public constructor() {
        super();

        this.socket = this.createSocket("authentication", false);
        this.store = require('../store');
        this.initSocketListener(this.socket);
    }

    public login(userName: string, password: string, userType: UserType): void {
        this.socket.emit(AuthenticationEvent.LOGIN,
            new LoginRequest(userName, password, UserType.AGENT));
    }

    private initSocketListener(socket: SocketIO.Server): void {
        socket.on(SocketEvent.CONNECT, () => {
            this.store.dispatch(LOGIN_ERROR(null));
        });

        socket.on(SocketEvent.CONNECT_ERROR, (error) => {
            this.store.dispatch(LOGIN_ERROR('Connection to socket server failed. ' + JSON.stringify(error)));
        });

        socket.on(SocketEvent.CONNECT_TIMEOUT, () => {
            this.store.dispatch(LOGIN_ERROR('Connection to socket server timeout.'));
        });

        socket.on(AuthenticationEvent.AUTHORIZED, (result: AuthenticationResult) => {
            window.localStorage.setItem('token', result.token);
            window.location.replace('/');
        });

        socket.on(AuthenticationEvent.UNAUTHORIZED, (error) => {
            this.store.dispatch(LOGIN_ERROR('Invalid Login.'));
        });

        socket.on('error', (error) => {
            this.store.dispatch(LOGIN_ERROR(error));
        });
    }
}
