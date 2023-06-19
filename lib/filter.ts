export function Filter(data: any) {
    
    console.log(data.tx_hash)
    if(data.tx_hash === "0x5aa42fc77f6c4b3d63cd080e8e50b6dc7d298b3934fff03e13b0b7f6b98269b2"){
        console.log("hit")
        return true;
    }
    return false;
}

export function Filter2(data: any) {
    
    console.log(data.tx_hash)
    if(data.tx_hash === "0x5aa42fc77f6c4b3d63cd080e8e50b6dc7d298b3934fff03e13b0b7f6b98269b2"){
        console.log("hit")
        return true;
    }
    return false;
}