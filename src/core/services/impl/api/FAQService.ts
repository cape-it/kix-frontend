import {
    FAQArticleProperty, Attachment, FAQArticleAttachmentLoadingOptions, CreateFAQVoteOptions, FAQCategoryFactory
} from "../../../model/kix/faq";
import { KIXObjectService } from "./KIXObjectService";
import {
    KIXObjectType, KIXObjectLoadingOptions, KIXObjectSpecificLoadingOptions,
    KIXObjectSpecificCreateOptions, Error
} from "../../../model";
import { KIXObjectServiceRegistry } from "../../KIXObjectServiceRegistry";
import { LoggingService } from "../LoggingService";

export class FAQService extends KIXObjectService {

    protected objectType: KIXObjectType = KIXObjectType.FAQ_ARTICLE;

    private static INSTANCE: FAQService;

    public static getInstance(): FAQService {
        if (!FAQService.INSTANCE) {
            FAQService.INSTANCE = new FAQService();
        }
        return FAQService.INSTANCE;
    }

    private constructor() {
        super([new FAQCategoryFactory()]);
        KIXObjectServiceRegistry.registerServiceInstance(this);
    }

    public isServiceFor(type: KIXObjectType): boolean {
        return type === KIXObjectType.FAQ_ARTICLE
            || type === KIXObjectType.FAQ_ARTICLE_ATTACHMENT
            || type === KIXObjectType.FAQ_ARTICLE_HISTORY
            || type === KIXObjectType.FAQ_CATEGORY
            || type === KIXObjectType.FAQ_VOTE;
    }

    protected RESOURCE_URI: string = 'faq';

    public async loadObjects<T>(
        token: string, clientRequestId: string, objectType: KIXObjectType, objectIds: Array<number | string>,
        loadingOptions: KIXObjectLoadingOptions, objectLoadingOptions: KIXObjectSpecificLoadingOptions
    ): Promise<T[]> {
        let objects = [];

        switch (objectType) {
            case KIXObjectType.FAQ_ARTICLE:
                const articlesUri = this.buildUri(this.RESOURCE_URI, 'articles');
                objects = await super.load(token, objectType, articlesUri, loadingOptions, objectIds, 'FAQArticle');
                break;
            case KIXObjectType.FAQ_CATEGORY:
                const categoryUri = this.buildUri(this.RESOURCE_URI, 'categories');
                objects = await super.load(token, objectType, categoryUri, loadingOptions, objectIds, 'FAQCategory');
                break;
            case KIXObjectType.FAQ_ARTICLE_ATTACHMENT:
                objects = await this.loadAttachment(
                    token, loadingOptions, (objectLoadingOptions as FAQArticleAttachmentLoadingOptions)
                );
                break;
            default:
        }

        return objects;
    }

    public createObject(
        token: string, clientRequestId: string, objectType: KIXObjectType, parameter: Array<[string, string]>,
        createOptions: KIXObjectSpecificCreateOptions
    ): Promise<string | number> {
        switch (objectType) {
            case KIXObjectType.FAQ_ARTICLE:
                return this.createFAQArticle(token, clientRequestId, parameter);
            case KIXObjectType.FAQ_VOTE:
                return this.createFAQVote(token, clientRequestId, parameter, (createOptions as CreateFAQVoteOptions));
            default:
                const error = 'No create option for object type ' + objectType;
                throw error;
        }
    }

    public async updateObject(
        token: string, clientRequestId: string, objectType: KIXObjectType,
        parameter: Array<[string, any]>, objectId: number
    ): Promise<string | number> {
        const updateParameter = parameter.filter(
            (p) => p[0] !== FAQArticleProperty.LINK && p[0] !== FAQArticleProperty.ATTACHMENTS
        );

        const uri = this.buildUri(this.RESOURCE_URI, 'articles', objectId);
        const id = await super.executeUpdateOrCreateRequest(
            token, clientRequestId, updateParameter, uri, this.objectType, 'FAQArticleID'
        );

        const attachments = parameter.find((p) => p[0] === FAQArticleProperty.ATTACHMENTS);
        await this.updateAttachments(
            token, clientRequestId, objectId, attachments && attachments.length ? attachments[1] : []
        );

        return id;
    }

    private async updateAttachments(
        token: string, clientRequestId: string, objectId: number, attachments: Attachment[]
    ): Promise<void> {
        const uri = this.buildUri(this.RESOURCE_URI, 'articles', objectId, 'attachments');

        const existingAttachments = await super.load<Attachment>(
            token, KIXObjectType.FAQ_ARTICLE_ATTACHMENT, uri, null, null, 'Attachment'
        );

        const deletableAttachments = existingAttachments
            ? existingAttachments.filter((a) => a.Disposition !== 'inline' && !attachments.some((at) => at.ID === a.ID))
            : [];

        for (const attachment of deletableAttachments) {
            const attachmentUri = this.buildUri(this.RESOURCE_URI, 'articles', objectId, 'attachments', attachment.ID);
            await this.sendDeleteRequest(token, clientRequestId, attachmentUri, this.objectType);
        }

        const newAttachments = attachments ? attachments.filter((a) => !a.ID) : [];
        for (const attachment of newAttachments) {
            const parameter: Array<[string, any]> = [];
            for (const p in attachment) {
                if (attachment[p]) {
                    parameter.push([p, attachment[p]]);
                }
            }

            await super.executeUpdateOrCreateRequest(
                token, clientRequestId, parameter, uri, KIXObjectType.FAQ_ARTICLE_ATTACHMENT, 'AttachmentID', true
            ).catch((error: Error) => {
                LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
                throw new Error(error.Code, error.Message);
            });
        }
    }

    private async createFAQArticle(
        token: string, clientRequestId: string, parameter: Array<[string, any]>
    ): Promise<number> {
        const createParameter = parameter.filter((p) => p[0] !== FAQArticleProperty.LINK);
        const uri = this.buildUri(this.RESOURCE_URI, 'articles');

        const id = await super.executeUpdateOrCreateRequest(
            token, clientRequestId, createParameter, uri, this.objectType, 'FAQArticleID', true
        ).catch((error: Error) => {
            LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
            throw new Error(error.Code, error.Message);
        });

        await this.createLinks(
            token, clientRequestId, id, this.getParameterValue(parameter, FAQArticleProperty.LINK)
        );

        return id;
    }

    private async createFAQVote(
        token: string, clientRequestId: string, parameter: Array<[string, any]>, createOptions: CreateFAQVoteOptions
    ): Promise<number> {
        const uri = this.buildUri(this.RESOURCE_URI, 'articles', createOptions.faqArticleId, 'votes');

        const id = await super.executeUpdateOrCreateRequest(
            token, clientRequestId, parameter, uri, KIXObjectType.FAQ_VOTE, 'FAQVoteID', true
        ).catch((error: Error) => {
            LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
            throw new Error(error.Code, error.Message);
        });

        return id;
    }

    public async loadAttachment(
        token: string, loadingOptions: KIXObjectLoadingOptions, objectLoadingOptions: FAQArticleAttachmentLoadingOptions
    ): Promise<Attachment[]> {
        if (objectLoadingOptions) {
            const uri = this.buildUri(
                this.RESOURCE_URI,
                'articles', objectLoadingOptions.faqArticleId,
                'attachments', objectLoadingOptions.attachmentId
            );

            const attachments = await super.load<Attachment>(token, null, uri, loadingOptions, null, 'Attachment');
            return attachments;
        } else {
            const error = 'No FAQArticleAttachmentLoadingOptions given.';
            throw error;
        }
    }

}
