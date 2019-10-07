/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

/* tslint:disable */

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { TreeNode, TreeUtil, TreeNavigationHandler } from '../../../src/core/model';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Browser / Components / Tree - Keyboard Navigation - Arrow Up/Down', () => {

    describe('flat list - simple down navigation (ArrowDown) (without filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id1', 'label1'),
                new TreeNode('id2', 'label2'),
                new TreeNode('id3', 'label3')
            ];
            TreeUtil.linkTreeNodes(tree, null);
            navigationHandler = new TreeNavigationHandler();
            navigationHandler.setTree(tree);
        });

        it('Should select the first element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id1');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id2');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the third and last element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id3');
            expect(navigationNode.navigationNode).true;
        });
    });

    describe('flat list - simple up navigation (ArrowUp) (without filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id1', 'label1'),
                new TreeNode('id2', 'label2'),
                new TreeNode('id3', 'label3')
            ];
            TreeUtil.linkTreeNodes(tree, null);
            navigationHandler = new TreeNavigationHandler(); navigationHandler.setTree(tree);
        });

        it('Should select the last element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id3');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id2');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id1');
            expect(navigationNode.navigationNode).true;
        });
    });

    describe('flat list - simple down navigation (ArrowDown) (with filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id11', 'label11'),
                new TreeNode('id21', 'label21'),
                new TreeNode('id12', 'label12'),
                new TreeNode('id22', 'label22'),
                new TreeNode('id13', 'label13'),
                new TreeNode('id23', 'label23')
            ];
            TreeUtil.linkTreeNodes(tree, 'label2');
            navigationHandler = new TreeNavigationHandler(); navigationHandler.setTree(tree);
        });

        it('Should select the first visible element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id21');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second visible element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id22');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the third and last visible element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id23');
            expect(navigationNode.navigationNode).true;
        });
    });

    describe('flat list - simple up navigation (ArrowUp) (with filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id11', 'label11'),
                new TreeNode('id21', 'label21'),
                new TreeNode('id12', 'label12'),
                new TreeNode('id22', 'label22'),
                new TreeNode('id13', 'label13'),
                new TreeNode('id23', 'label23')
            ];
            TreeUtil.linkTreeNodes(tree, 'label2');
            navigationHandler = new TreeNavigationHandler();
            navigationHandler.setTree(tree);
        });

        it('Should select the last visible element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id23');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second visible element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id22');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first visible element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id21');
            expect(navigationNode.navigationNode).true;
        });
    });

    describe('tree - full expanded - simple down navigation (ArrowDown) (without filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id1', 'label1', null, null, [
                    new TreeNode('id11', 'label11'),
                    new TreeNode('id12', 'label12')
                ], null, null, null, null, true),
                new TreeNode('id2', 'label2', null, null, [
                    new TreeNode('id21', 'label21'),
                    new TreeNode('id22', 'label22')
                ], null, null, null, null, true),
                new TreeNode('id3', 'label3', null, null, [
                    new TreeNode('id31', 'label31'),
                    new TreeNode('id32', 'label32')
                ], null, null, null, null, true)
            ];
            TreeUtil.linkTreeNodes(tree, null);
            navigationHandler = new TreeNavigationHandler(); navigationHandler.setTree(tree);
        });

        it('Should select the first root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id1');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id11');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id12');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id2');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id21');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id22');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the third root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id3');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id31');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id32');
            expect(navigationNode.navigationNode).true;
        });

    });

    describe('tree - full expanded - simple up navigation (ArrowUp) (without filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id1', 'label1', null, null, [
                    new TreeNode('id11', 'label11'),
                    new TreeNode('id12', 'label12')
                ], null, null, null, null, true),
                new TreeNode('id2', 'label2', null, null, [
                    new TreeNode('id21', 'label21'),
                    new TreeNode('id22', 'label22')
                ], null, null, null, null, true),
                new TreeNode('id3', 'label3', null, null, [
                    new TreeNode('id31', 'label31'),
                    new TreeNode('id32', 'label32')
                ], null, null, null, null, true)
            ];
            TreeUtil.linkTreeNodes(tree, null);
            navigationHandler = new TreeNavigationHandler();
            navigationHandler.setTree(tree);
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id32');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id31');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the third root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id3');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id22');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id21');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id2');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id12');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id11');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id1');
            expect(navigationNode.navigationNode).true;
        });

    });

    describe('tree - full expanded - simple down navigation (ArrowDown) (with filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id1', 'label1', null, null, [
                    new TreeNode('id11', 'label11'),
                    new TreeNode('id12', 'label12')
                ], null, null, null, null, true),
                new TreeNode('id2', 'label2', null, null, [
                    new TreeNode('id21', 'label21'),
                    new TreeNode('id22', 'label22')
                ], null, null, null, null, true),
                new TreeNode('id3', 'label3', null, null, [
                    new TreeNode('id31', 'label31'),
                    new TreeNode('id32', 'label32')
                ], null, null, null, null, true)
            ];
            TreeUtil.linkTreeNodes(tree, 'label2');
            navigationHandler = new TreeNavigationHandler();
            navigationHandler.setTree(tree);
        });

        it('Should select the second root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id2');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id21');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowDown' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id22');
            expect(navigationNode.navigationNode).true;
        });

    });

    describe('tree - full expanded - simple up navigation (ArrowUp) (with filter)', () => {
        let tree;
        let navigationHandler: TreeNavigationHandler;

        before(() => {
            tree = [
                new TreeNode('id1', 'label1', null, null, [
                    new TreeNode('id11', 'label11'),
                    new TreeNode('id12', 'label12')
                ], null, null, null, null, true),
                new TreeNode('id2', 'label2', null, null, [
                    new TreeNode('id21', 'label21'),
                    new TreeNode('id22', 'label22')
                ], null, null, null, null, true),
                new TreeNode('id3', 'label3', null, null, [
                    new TreeNode('id31', 'label31'),
                    new TreeNode('id32', 'label32')
                ], null, null, null, null, true)
            ];
            TreeUtil.linkTreeNodes(tree, 'label2');
            navigationHandler = new TreeNavigationHandler();
            navigationHandler.setTree(tree);
        });

        it('Should select the second child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id22');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the first child', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id21');
            expect(navigationNode.navigationNode).true;
        });

        it('Should select the second root element', () => {
            navigationHandler.handleEvent({ key: 'ArrowUp' });

            const navigationNode = navigationHandler.findNavigationNode();
            expect(navigationNode).exist;
            expect(navigationNode.id).equals('id2');
            expect(navigationNode.navigationNode).true;
        });
    });

});