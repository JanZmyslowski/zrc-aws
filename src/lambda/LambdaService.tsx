import config from '../config';
import { Lambda } from 'aws-sdk';
import { INote } from '../models/Note';
import Auth from '@aws-amplify/auth';
import { ITranslatedText } from '../models/TranslatedText';

export default class LambdaService {

    private static readonly lambda = new Lambda(
        {
            region: config.region,
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            sessionToken: config.sessionToken
        });


    public static async getNotes(): Promise<INote[]> {

        const user = await Auth.currentAuthenticatedUser();

        if (!(await this.ensureIsAuthenticated())) {
            return new Array<INote>();
        }

        const res = await this.lambda.invoke({
            FunctionName: 'getNotes',
            Payload: JSON.stringify({ user: user.username }),
        }).promise();
        let payload = JSON.parse(res.Payload as string);

        return payload.body.Items as INote[];;
    }

    public static async createOrUpdateNote(note: INote) {

        if (!(await this.ensureIsAuthenticated())) {
            return;
        }

        note.UpdatedAt = Date.now();

        return await this.lambda.invoke({
            FunctionName: 'createOrUpdateNote',
            Payload: JSON.stringify({ note: note }),
        }).promise();
    }

    public static async deleteNote(note: INote) {

        if (!(await this.ensureIsAuthenticated())) {
            return;
        }

        return await this.lambda.invoke({
            FunctionName: 'deleteNote',
            Payload: JSON.stringify({ note: note }),
        }).promise();
    }

    public static async translateNote(note: INote, targetLang: string, sourceLang: string | null = null): Promise<ITranslatedText | null> {

        if (!(await this.ensureIsAuthenticated())) {
            return null;
        }

        const res = await this.lambda.invoke({
            FunctionName: 'translateNote',
            Payload: JSON.stringify({ targetLang: targetLang, note: note.Content, sourceLang: sourceLang }),
        }).promise();

        let payload = JSON.parse(res.Payload as string);
        return payload.body;
    }

    private static async ensureIsAuthenticated(): Promise<boolean> {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return true;
        } catch {
            return false;
        }
    }
};

