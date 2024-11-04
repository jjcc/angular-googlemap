declare module 'express' {
    import { Server } from 'http';

    interface Handler {
        (req: Request, res: Response): any;
    }

    interface Request {
        url: string;
        baseUrl: string;
        params: any;
    }

    interface Response {
        render(view: string, options?: any): void;
        headersSent: boolean;
    }

    interface Express {
        (): App;
        static: any;
    }

    interface App {
        engine(ext: string, fn: any): void;
        set(setting: string, val: any): void;
        get(path: string, handler: Handler): void;
        listen(port: number | string, callback?: () => void): Server;
        use(path: string, ...handlers: any[]): void;
    }

    namespace express {
        export interface Express extends App {}
    }

    const express: Express & { Express: Express };
    export = express;
}

declare module '@nguniversal/express-engine' {
    export function ngExpressEngine(options: any): any;
}
