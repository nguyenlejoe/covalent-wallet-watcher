export interface Iconfig  {
    alerts: Alert[]
}
  
export interface Alert {
    id: number
    name: string
    endpoint: endpoint
    payload: payload[]
    email: email
    telegram: telegram
    filter: Function
  
}
  
export enum endpoint {
    transactions_v2 = "transactions_v2",
    transactions_v3 = "transactions_v3",
    balances_v2 = "balances_v2"
}
  
export interface payload {
    address: string;
    chainName: string;
}
  
export interface email {
    active: boolean
    to: string[]
}
  
export interface telegram {
    active: boolean
}

export interface ping {
    ping: boolean,
    message: string,
    subject: string
}