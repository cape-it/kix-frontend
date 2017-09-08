import { UserListComponentState } from './model/UserListComponentState';
import { UserListState } from './store/UserListState';
import { USER_LIST_INITIALIZE } from './store/actions';

class UserListWidgetComponent {

    public state: UserListComponentState;

    private store: any;

    private frontendSocketUrl: string;

    public onCreate(input: any): void {
        this.state = new UserListComponentState();
        this.frontendSocketUrl = input.frontendSocketUrl;
    }

    public onMount(): void {
        this.store = require('./store');
        this.store.subscribe(this.stateChanged.bind(this));
        this.store.dispatch(USER_LIST_INITIALIZE(this.frontendSocketUrl));
    }

    public stateChanged(): void {
        const reduxState: UserListState = this.store.getState();
        if (reduxState.configuration) {
            this.state.configuration = reduxState.configuration;
            (this as any).emit("configurationLoaded", this.state.configuration);
        }

        if (reduxState.users) {
            this.state.users = reduxState.users;
        }

        if (reduxState.error) {
            this.state.error = reduxState.error;
        }
    }
}

module.exports = UserListWidgetComponent;
