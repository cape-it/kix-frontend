import { DialogService } from '@kix/core/dist/browser/dialog/DialogService';
import { MainDialogComponentState } from './MainDialogComponentState';
import { IMainDialogListener, ContextService } from '@kix/core/dist/browser';
import { ConfiguredDialogWidget, ObjectIcon, Context } from '@kix/core/dist/model';

export class MainDialogComponent implements IMainDialogListener {

    private state: MainDialogComponentState;

    public onCreate(): void {
        this.state = new MainDialogComponentState();
    }

    public onMount(): void {
        DialogService.getInstance().registerMainDialogListener(this);
    }

    public open(
        dialogTitle: string, dialogs: ConfiguredDialogWidget[], dialogId?: string, dialogIcon?: string | ObjectIcon
    ): void {
        if (!this.state.show) {
            this.state.isLoading = true;
            this.state.dialogTitle = dialogTitle;
            this.state.dialogIcon = dialogIcon;
            this.state.dialogWidgets = dialogs;
            this.state.show = true;
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                this.tabChanged(dialogs.find((d) => d.instanceId === dialogId));
                setTimeout(() => {
                    this.state.isLoading = false;
                }, 100);
            }, 100);
        }
    }

    public close(): void {
        this.state.show = false;
        document.body.style.overflow = 'unset';
        ContextService.getInstance().closeDialogContext();
    }

    public tabChanged(tab: ConfiguredDialogWidget): void {
        if (tab) {
            this.state.dialogId = tab.instanceId;
            ContextService.getInstance().setDialogContext(null, tab.kixObjectType, tab.contextMode);
        }
    }

    public setTitle(title: string): void {
        this.state.dialogTitle = title;
    }

    public setHint(hint: string): void {
        this.state.dialogHint = hint;
    }

    public setLoading(isLoading: boolean, loadingHint: string, showClose: boolean = false): void {
        this.state.loadingHint = loadingHint;
        this.state.isLoading = isLoading;
        this.state.showClose = showClose;
    }

}

module.exports = MainDialogComponent;
