export const config = {
  "alerts": [
    {
        "id": 1,
        "name": "first alert",
        "addresses" : [
            "0x9507c04B10486547584C37bCBd931B2a4FeE9A41"
        ],
        "message": "Jump Trading Activity",
        "filter": (data: any) => {
            const to_filter = "0x9507c04B10486547584C37bCBd931B2a4FeE9A41";
            const raw_log_topics_filter_1 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
            const raw_log_topics_filter_2 = "0x0000000000000000000000009507c04B10486547584C37bCBd931B2a4FeE9A41"
            let ping = false;

            if(data.to_address !== to_filter){
              return ping;
            }

            for(const i of data.log_events){
                if(i.raw_log_topics[0] === raw_log_topics_filter_1.toLowerCase()){
                    if(i.raw_log_topics[2] === raw_log_topics_filter_2.toLowerCase()){
                        ping = true;
                        break;
                    }
                }
            }

            return ping;
        }
    }
  ]
}

////// FILTERS
// "successful": true
// "to_address": "0xE592427A0AEce92De3Edee1F18E0157C05861564"
// "log_events" [ "raw_log_topics": ["0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"] ]