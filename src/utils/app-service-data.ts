const dotenv = require('dotenv');
dotenv.config();
export const globalConfig = {
  mongoDbUrl: 'not used',
  bucketName: 'not used',
  accessKey: 'not used',
  secretAccessKey: 'not used',
  secret:process.env.SECRET ,
  localIp: null,
  geoCoderOption: {
    provider: 'google',
    apiKey: "process.env.GoogleApiKey",
    formatter: null,
    country: "process.env.Google_Country",
  },
  deliveryCharges: 10,
};

export interface CommonResponseModel {
  response_code: number;
  response_data: any;
  extra?: string;
}
