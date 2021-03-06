/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

/* tslint:disable */

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { InlineContent } from '../../src/frontend-applications/agent-portal/modules/base-components/webapp/core/InlineContent';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('InlineContent', () => {

    describe('Prepare ContentType without semicolon', () => {

        let inlineContent: InlineContent;

        before(() => {
            inlineContent = new InlineContent('test', 'test', 'application/json');
        });

        it('Have the correct ContentType', () => {
            expect(inlineContent.contentType).equals('application/json');
        });

    });

    describe('Prepare ContentType with semicolon', () => {

        let inlineContent: InlineContent;

        before(() => {
            inlineContent = new InlineContent('test', 'test', 'application/json;base64;something');
        });

        it('Have the correct ContentType', () => {
            expect(inlineContent.contentType).equals('application/json');
        });

    });
});