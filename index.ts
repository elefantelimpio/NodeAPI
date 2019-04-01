import * as dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import * as server from './app'

dotenv.config()


mongoose.connect(process.env.DB, {useFindAndModify: false}, connectionError => {
  if (connectionError) {
    return console.error(
      `Error while connecting to database: ${connectionError}`
    )
  }

  const app = new server.App(process.env.PORT)
  app.init()

  app.run()
})
