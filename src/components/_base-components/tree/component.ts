import { TreeComponentState } from './TreeComponentState';
import { TreeNode } from '@kix/core/dist/model';
import { TreeUtil } from './TreeUtil';

class TreeComponent {

    private state: TreeComponentState;

    public onCreate(input: any): void {
        this.state = new TreeComponentState();
    }

    public onInput(input: any): void {
        if (input.subTree) {
            this.state.displayTree = input.tree;
        } else {
            this.state.tree = TreeUtil.cloneTree(input.tree);
            this.initTree();
            if (input.filterInputId) {
                const filterElement = document.getElementById(input.filterInputId);
                if (filterElement) {
                    filterElement.addEventListener('keyup', this.filterValueChanged.bind(this));
                }
            }
        }
    }

    private initTree(expandNodes: boolean = false): void {
        const newTree = TreeUtil.cloneTree(this.state.tree);
        this.state.displayTree = TreeUtil.buildTree(newTree, this.state.filterValue, expandNodes);
    }

    private nodeClicked(node: TreeNode): void {
        (this as any).emit('nodeClicked', node);
    }

    private filterValueChanged(event: any): void {
        if (!this.navigationKeyPressed(event)) {
            this.state.filterValue = event.target.value;
            this.initTree(this.state.filterValue && this.state.filterValue !== '');
        }
    }

    private navigationKeyPressed(event: any): boolean {
        return event.keyCode === 13 || event.keyCode === 33 || event.keyCode === 34
            || event.keyCode === 38 || event.keyCode === 40;
    }

}

module.exports = TreeComponent;
