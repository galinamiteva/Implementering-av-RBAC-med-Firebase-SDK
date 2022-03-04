import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import moment = require('moment');

import { Config } from './config';
import { AppService } from './services/app.service';
import { PromoCodesService } from './services/promocodes.service';
import { PinCodesService } from './services/pincodes.service';
import { MessageService } from './services/message.service';
import { SettingsService } from './services/settings.service';
import { SitesService } from './services/sites.service';
import { AccountsService } from './services/accounts.service';
import { CustomersService } from './services/customers.service';
import { UsersService } from './services/users.service';
import { ProductsService } from './services/products.service';
import { ContractProductsService } from './services/contract-products.service';
import { ExtraProductsService } from './services/extra-products.service';
import { CheckoutProductsService } from './services/checkoutproducts.service';
import { AdminGUIService } from './services/admingui.service';
import {validateFirebaseIdToken } from './utils/validateFirebaseIdToken';
import { sendMailWithMailJet, sendSMSWithMailJet } from './services/mailjet-messages.service';

import { SystemLogService } from './services/systemlog.service';
import { ScheduleJobsService } from './services/schedulejobs.service';
import { BookingService } from './services/bookingusers.service';
import { authorizationHeaderMiddleware } from './utils/express.util';
import { ToolsService } from './services/tools.service';



export let AppMainConfig: any = null;

admin.initializeApp({
  credential: admin.credential.cert(Config.service_account_cert),
  databaseURL:Config.firebase_database_url  
});

admin.firestore().settings({ timestampsInSnapshots: true, experimentalForceLongPolling: true  });
 const regionalFunctions = functions.region('europe-west1');
  
 const db = admin.firestore();



export const usersService = new UsersService();
export const pinCodeService = new PinCodesService();
export const messageService = new MessageService();
export const promoCodesService = new PromoCodesService();
export const settingsService = new SettingsService();
export const sitesService = new SitesService();
export const accountsService = new AccountsService();
export const checkoutProductsService = new CheckoutProductsService();

export const customersService = new CustomersService();
export const productsService = new ProductsService();
export const contractProductsService = new ContractProductsService ;
export const extraProductsService = new ExtraProductsService();
export const adminGUIService = new AdminGUIService();
export const appService = new AppService();

import { Constants, getStripeKey } from './constants';
export const systemLogService = new SystemLogService();
export const scheduleJobsService = new ScheduleJobsService();
export const bookingService = new BookingService();
export const toolsService = ToolsService.Instance();

console.log('The emulators are on and env is>>> ',process.env.NODE_ENV);

import cors = require('cors');
const axios = require('axios').default;
const cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
const stripe = require('stripe')(getStripeKey());





/********************************************************************************************************************************************************/
/*************************************************ADMIN DEL*************************************************************/
/********************************************************************************************************************************************************/
const adm = express();
adm.use(cors({ origin: true }));


declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>
    }
  }
}

adm.use(cookieParser);
adm.use(bodyParser.json());
adm.use(bodyParser.urlencoded({ extended: false }));



//CRUD Sites*****************************************************************************
adm.get('/sites_simple', async (req, res) => {
  try {
    const sites = await sitesService.getSites();
    return res.status(200).send(sites);
  } catch (error) {
    console.log('error' + error);
    return res.status(500).send(error);
  }
});

adm.get('/sites', validateFirebaseIdToken, async (req, res) => {  
  const accIdFromToken = req.body.user.accountId;  
  if(req.body.user.role ==='ACCOUNT_USER'){
  try {
    const sites = await sitesService.getSitesByAccountId(accIdFromToken);
    return res.status(200).send(sites);
  } catch (error) {
    console.log('error' + error);
    return res.status(500).send(error);
  }
  }else{
    try {
      const sites = await sitesService.getSites();
      return res.status(200).send(sites);
    } catch (error) {
      console.log('error' + error);
      return res.status(500).send(error);
    }
  }
});

adm.delete('/site/:id', async (req, res) => {

  try {
    await db.collection('sites').doc(req.params.id).delete()
    console.log("en site var deleted")
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});


adm.post('/site', validateFirebaseIdToken, async (req, res) => {
  const accIdFromToken = req.body.user.accountId;
  if(req.body.user.role ==='ACCOUNT_USER'){
  try {
    const model = {
      name: req.body.name,
      accountId: accIdFromToken
    }
    await db.collection('sites').add(model);
    return res.status(200).send(model);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}else{
  try {
    const model = {
      name: req.body.name,
      accountId: req.body.accountId
    }
    await db.collection('sites').add(model);
    return res.status(200).send(model);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
});


adm.patch('/site/:id', validateFirebaseIdToken, async (req, res) => {
  const accIdFromToken = req.body.user.accountId;
  if(req.body.user.role ==='ACCOUNT_USER'){
  try {
    const model = {
      name: req.body.name,
      accountId: accIdFromToken,
    }
    const site = await db.collection('sites').doc(req.params.id).update(model);
    return res.status(200).send(site);
  } catch (error) {
    throw error;
  }
}else{
  try {
    const model = {
      name: req.body.name,
      accountId: req.body.accountId,
    }
    const site = await db.collection('sites').doc(req.params.id).update(model);
    return res.status(200).send(site);
  } catch (error) {
    throw error;
  }
}
});




exports.adm = regionalFunctions.https.onRequest(adm);
