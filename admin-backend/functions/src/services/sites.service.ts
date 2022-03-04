import * as admin from 'firebase-admin';
export class SitesService {
    db = admin.firestore();
 
     async getSites(): Promise<ISite[]> {
        const sites = await this.db.collection('sites').get();
        const resultArray: ISite[] = [];
        sites.forEach((result) => {
            const data = result.data() as ISite;
            data.id = result.id;
            resultArray.push(data);
        });
               
        return resultArray;
    };
    async getSitesByAccountId(accountId: string): Promise<ISite[]> {
        const sites = await this.db.collection('sites').where('accountId', '==', accountId).get();
        const resultArray: ISite[] = [];
        sites.forEach((result) => {
            const data = result.data() as ISite;
            data.id = result.id;
            resultArray.push(data);
        });
               
        return resultArray;
    };
   

    
}


