import { Controller, HttpService } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';

const fs = require('fs');
import * as mongoose from 'mongoose';

const path = require('path');
const exec = require('child_process').exec;

@Controller()
export class AppController {
  // constructor() {
    
  // }

  // @Cron('0 * * * *')
  // async createJob() {
  //   console.log('CRON EXECUTING');
  //   const mongoDbUrl: string = 'mongodb+srv://aditya:aditya@mycluster-towek.mongodb.net/groceries?retryWrites=true&w=majority';
  //   await mongoose.connect(mongoDbUrl, { useNewUrlParser: true });
  //   const collection = await mongoose.connection.db.collections();
  //   for (var c of collection) {
  //     await c.drop();
  //   }
  //   const cmd = `node mongo-seeding.js "${mongoDbUrl}"`;
  //   exec(cmd, (error, stdout, stderr) => {
  //     if (error) {
  //       console.log('ERROR', error);
  //     }
  //     if (stdout) {
  //       console.log('OUTPUT', stdout);
  //     }
  //     if (stderr) {
  //       console.log('STDERR', stderr);
  //     }
  //   });
  // }
}
