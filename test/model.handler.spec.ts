import * as chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
import * as mongoose from 'mongoose'
import { RoutesHandler } from '../api/routes.handler';
import { ModelsHandler, SyncRoutes } from '../models/model.module';

import * as dotenv from 'dotenv'
import * as server from '../app'

import bodyParser = require('body-parser')
import { TestHelper } from './test.helper';

describe('Testing models.handler', () => {
  
  chai.use(chaiHttp)
  dotenv.config()

  const app: server.App = new server.App(process.env.PORT)
  app.app.use(bodyParser.urlencoded({ extended: true }))
  app.app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
  app.app.use(bodyParser.json({ type: 'application/json-patch' }))
  app.app.use(bodyParser.json())

  TestHelper.removeMongooseModels()
  const routesHandler: RoutesHandler = new RoutesHandler(app.app)

  it('syncRoutes(): Testing routes to "sync"', async () => {
    const modelsHandler = new ModelsHandler()
    let syncRoutes: SyncRoutes
    
    const schemaDoc: any = {
      collection_name: 'test_collection',
      collection_schema: '{"name": "String"}'
    }
    await modelsHandler.syncRoutes()

    await mongoose.connection.models.collections_schemas.insertMany([schemaDoc])

    syncRoutes = await modelsHandler.syncRoutes()
    
    const routesToSync = syncRoutes.routesToSync
    // console.log('routesToSync', routesToSync)
    chai.assert(
      chai.expect(routesToSync).to.be.an('array').and.not.be.empty.and.to.have.deep.property('collectionName', 'test_collection')
    )
  })

  it('syncRoutes(): Testing routes to "unsync"', async () => {
    const modelsHandler = new ModelsHandler()    
    await modelsHandler.init()
    await mongoose.connection.models.collections_schemas.findOneAndDelete({'collection_name': {$eq: 'test_collection'}})

    const syncRoutes: SyncRoutes = await modelsHandler.syncRoutes()
    
    const routesToUnsync = syncRoutes.routesToUnsync
    
    chai.assert(
      chai.expect(routesToUnsync).to.be.an('array').and.not.be.empty.and.equals(['test_collection'])
    )
  })
})
