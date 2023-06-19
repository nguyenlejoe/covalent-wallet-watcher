export function TransactionsFilter(data: any, filter: any, callback: Function) {
    if(callback(data)) {
        return true;
    }
    return false;
}
