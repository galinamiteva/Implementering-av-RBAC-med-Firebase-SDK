interface IPromoCode {
    id: string;
    code: string;
    tries: number;
    procentDiscount: number;
    validUntil: Date;
    created: Date;
    accountId:string;
    companyName:string;
  }
  
  interface ISite {
    id: string;
    name: string;
    accountId:string; 
  }
  
  interface IAccount {
    id: string;
    companyName:string;
    contactPerson:string; 
    email: string;
    phone:number;
    type:string;   
  }
  
  interface ICheckout {
    id: string;
    name:string;
    price:number;
    imageUrl: string;
    accountId:string; 
    created: Date;
    
  }
  
  interface IUser {
    id: string;
    password:string;
    email: string;
    name: string;
    phoneNumber:number;
    role:string;
    accountId:string; 
  
  }
  interface IContractProduct {
    id: string;
    accountId:string;
    created: Date;
    name: string;
    price:number;
    status:boolean;
  }
  interface IExtraProduct {
    id: string;
    productId:string;
    accountId:string;
    created: Date;
    name: string;  
    imageUrl:string;
    status:boolean;
  }
  interface IProduct {
    id: string;
    accountId:string;
    created: Date;
    name: string;
    hourPrice:number;
    imageUrl:string;
  }
  interface ICustomer {
    id: string;
    accountId:string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber:number;
    created: Date;
    
  }
  interface IActivityLog {
    created: Date;
    message: string;
    type: 'Info' | 'Error' | 'Warning';
  }
  
  interface IBookingLog {
    userId: string;
    amountWithdrawn: number;
    chargeId: string;
    chargeType: 'Stripe' | 'Swish'
    created: Date;
    refunded: boolean;
    type: 'Booked' | 'Canceled';
  }
  
  interface BookingUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    created?: Date;
    facebookId?: string;
    stripe_customer_id?: string;
  }