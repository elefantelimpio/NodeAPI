import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { TestHelper } from './test.module';

dotenv.config();
before(done => {
  mongoose.connect(process.env.MONGO_URL, { useFindAndModify: false }, connectionError => {
    if (connectionError) {
      done();
      return console.warn(
        `Error while connecting to database: ${connectionError}`
      );
    }
    console.log(`Connected! ${process.env.MONGO_URL}`);
    done();
  });
});

afterEach(done => {
  TestHelper.removeMongooseModelCollectionsSchemas();
  done();
});

beforeEach(done => {
  TestHelper.removeMongooseModelAuditLog();
  done();
});
