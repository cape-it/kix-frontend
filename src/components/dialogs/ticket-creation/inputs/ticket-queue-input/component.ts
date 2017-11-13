import { CreationTicketStore } from './../../store/index';
import { TicketCreationReduxState } from './../../store/TicketCreationReduxState';
import { QUEUE_ID_CHANGED } from '../../store/actions';
import { TicketCreationProcessReduxState } from '../../store/TicketCreationProcessReduxState';

class TicketQueueInput {

    public state: any;

    public onCreate(input: any): void {
        this.state = {
            queueId: null,
            queues: []
        };
    }

    public onMount(): void {
        CreationTicketStore.getInstance().addStateListener(this.stateChanged.bind(this));
        this.setStoreData();
    }

    public stateChanged(state: TicketCreationReduxState): void {
        this.setStoreData();
    }

    public valueChanged(event: any): void {
        CreationTicketStore.getInstance().getStore().dispatch(QUEUE_ID_CHANGED(event.target.value));
    }

    private setStoreData(): void {
        const reduxState: TicketCreationReduxState = CreationTicketStore.getInstance().getTicketState();
        const processState: TicketCreationProcessReduxState = CreationTicketStore.getInstance().getProcessState();

        this.state.queueId = Number(reduxState.queueId);
        this.state.queues = processState.queues;
    }

}

module.exports = TicketQueueInput;
