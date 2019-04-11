import { ComponentState } from './ComponentState';
import { ToolbarAction } from './ToolbarAction';
import { ActionFactory, ContextService } from '../../../../core/browser';
import { ShowUserTicketsAction } from '../../../../core/browser/ticket';
import { TranslationService } from '../../../../core/browser/i18n/TranslationService';
import { ObjectDataService } from '../../../../core/browser/ObjectDataService';
import { AgentService } from '../../../../core/browser/application/AgentService';

class Component {

    public state: ComponentState;

    public onCreate(input: any): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        const user = await AgentService.getInstance().getCurrentUser();

        const myTicketsNewArticles = await TranslationService.translate('Translatable#My tickets with new articles');
        const myTickets = await TranslationService.translate('Translatable#My Tickets');
        const myWatchedTicketsNewArticles = await TranslationService.translate(
            'Translatable#My watched tickets with new articles'
        );
        const myWatchedTickets = await TranslationService.translate('Translatable#My watched tickets');
        const myLockedTicketsNewArticles = await TranslationService.translate(
            'Translatable#My locked tickets with new articles'
        );
        const myLockedTickets = await TranslationService.translate('Translatable#My locked tickets');

        this.state.toolbarGroups = [
            [
                new ToolbarAction(
                    'kix-icon-man', myTicketsNewArticles, true, user.Tickets.OwnedAndUnseen.length,
                    'show-user-tickets', user.Tickets.OwnedAndUnseen.map((id) => Number(id))
                ),
                new ToolbarAction(
                    'kix-icon-man', myTickets, false,
                    user.Tickets.Owned.length,
                    'show-user-tickets', user.Tickets.Owned
                )
            ],
            [
                new ToolbarAction(
                    'kix-icon-eye', myWatchedTicketsNewArticles, true,
                    user.Tickets.WatchedAndUnseen.length,
                    'show-user-tickets', user.Tickets.WatchedAndUnseen.map((id) => Number(id))
                ),
                new ToolbarAction(
                    'kix-icon-eye', myWatchedTickets, false,
                    user.Tickets.Watched.length,
                    'show-user-tickets', user.Tickets.Watched.map((id) => Number(id))
                )
            ],
            [
                new ToolbarAction(
                    'kix-icon-lock-close', myLockedTicketsNewArticles, true,
                    user.Tickets.OwnedAndLockedAndUnseen.length,
                    'show-user-tickets', user.Tickets.OwnedAndLockedAndUnseen.map((id) => Number(id))
                ),
                new ToolbarAction(
                    'kix-icon-lock-close', myLockedTickets, false,
                    user.Tickets.OwnedAndLocked.length,
                    'show-user-tickets', user.Tickets.OwnedAndLocked.map((id) => Number(id))
                )
            ]
        ];
    }

    public async actionClicked(action: ToolbarAction): Promise<void> {
        const actions = await ActionFactory.getInstance().generateActions([action.actionId], action.actionData);
        if (actions && actions.length) {
            const showTicketsAction = actions[0] as ShowUserTicketsAction;
            showTicketsAction.setText(action.title);
            showTicketsAction.run();
        }
    }

}

module.exports = Component;
