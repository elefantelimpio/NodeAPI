import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as i18n from 'i18n';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import { Server } from 'http';
import { RoutesHandler } from './api/routes.handler';
import { SyncHandler } from './api/sync.handler';
import { AuthController } from './api/controllers/auth.controller';
import { PermissionsMidleware } from './api/middlewares/permissions-middleware';
import { ErrorHandler } from './api/middlewares/error-handler-middleware';

export class App {
  public app: express.Application;
  protected routesHandler: RoutesHandler;
  protected syncHandler: SyncHandler;
  protected port: string;
  protected authController: AuthController;

  constructor(port: string) {
    this.port = port;
    this.app = express();
  }

  public async init() {
    try {
      this.routesHandler = new RoutesHandler(this.app);
      this.syncHandler = new SyncHandler(this.routesHandler);
      this.authController = new AuthController();

      this.authController.init();
      this.initi18n();
      this.useMiddlewares();
      await this.mountRoutes();

      this.syncHandler.setSyncSchemaRoute();
    } catch (e) {
      console.error(e);
    }
  }

  public run(): Server {
    return this.app.listen(this.port, () => {
      console.info(`API REST running in http://localhost:${this.port}`);
    });
  }

  public useMiddlewares(): void {
    this.app.use(morgan('dev'));

    this.useBodyParser();

    this.app.use(methodOverride());

    this.app.use(this.tokenMiddleware);

    this.app.use(i18n.init);
    this.app.use(this.i18nSetLocaleMiddleware);
    this.app.use(PermissionsMidleware.canIDo);

    this.app.use(ErrorHandler.handleError);
  }

  public useBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    this.app.use(bodyParser.json({ type: 'application/json-patch' }));
    this.app.use(bodyParser.json());
  }

  public initi18n(): void {
    i18n.configure({
      cookie: 'language-cookie',
      directory: __dirname + '/locales',
      locales: ['en', 'es', 'fr', 'es', 'pt', 'de']
    });
  }

  private tokenMiddleware = async (req, res, next) => {
    try {
      const secret: string = req.header('token');
      if (secret === undefined) {
        res.status(401);
        next('Unauthorized');
      }

      const isTokenValid: boolean = await this.authController.isTokenValid(secret);
      if (isTokenValid === false) {
        res.status(401);
        next('The token provided is not valid');
      }

      next();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  private i18nSetLocaleMiddleware(req, res, next) {
    if (
      req.cookies !== undefined &&
      req.cookies['language-cookie'] !== undefined
    ) {
      res.setLocale(req.cookies['language-cookie']);
    }
    next();
  }

  private async mountRoutes() {
    try {
      await this.routesHandler.init();
    } catch (e) {
      console.error('Unexpected error occurred in mountRoutes()', e);
    }
  }
}
