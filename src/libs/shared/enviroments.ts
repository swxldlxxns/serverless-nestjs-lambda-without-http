export interface Environments {
  accountId: string;
  stage: string;
  region: string;
  appQueue: string;
}

export const ENV_VARS: Environments = {
  accountId: process.env.ACCOUNT_ID,
  stage: process.env.STAGE,
  region: process.env.REGION,
  appQueue: process.env.APP_QUEUE,
};
