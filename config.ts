import { Iconfig, endpoint, ping } from "./lib/types";


export const config: Iconfig = {
  "alerts": [
    {
        "id": 1,
        "name": "Uniswap Trade Alert: Large MEV Bot",
        "endpoint": endpoint.transactions_v3,
        "payload" : [
          {
            address: "0xA69BABEF1CA67A37FFAF7A485DFFF3382056E78C", // MEV Bot
            chainName: "eth-mainnet"
          }
        ],
        "email": {
            "active": true,
            "to": ["test@email.com"]
          },
          "telegram": {
            "active" : true
          },
        "filter": (data: any): ping => {
            const to_filter = "0xA69BABEF1CA67A37FFAF7A485DFFF3382056E78C";
            const raw_log_topics_filter_1 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
            const raw_log_topics_filter_2 = "0x000000000000000000000000A69BABEF1CA67A37FFAF7A485DFFF3382056E78C"
            let ping = {
                ping: false,
                message: "Uniswap Swap Event",
                subject: "New activity alert"
            }

            if(data.to_address !== to_filter.toLowerCase()){
              return ping;
            }

            if(!data.successful){
                return ping
            }

            for(const i of data.log_events){
                if(i.raw_log_topics[0] === raw_log_topics_filter_1.toLowerCase()){
                    if(i.raw_log_topics[2] === raw_log_topics_filter_2.toLowerCase()){
                        ping.ping = true;
                        break;
                    }
                }
            }

            // Message and subject can be edited and customized

            ping.message = `${data.alert_name}:\n\nUniswap Swap Event\n\nTransaction was ${data.successful ? "successful" : ""}`;
                     
            return ping;
        }
    }, 
    {
      "id": 2,
      "name": "Aave Withdraw Watcher: Large Aave Depositor",
      "endpoint": endpoint.transactions_v3,
      "payload" : [
        {
          address:   "0x9026A229b535ecF0162Dfe48fDeb3c75f7b2A7AE", // $14M in net deposits into Aave. We are watching for a Withdraw
          chainName: "eth-mainnet"
        }
      ],
      "email": {
        "active": true,
        "to": ["test@email.com"]
      },
      "telegram": {
        "active" : true
      },
      "filter": (data: any) => {
          const to_filter = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
          const raw_log_topics_filter_1 = "0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7"
          const raw_log_topics_filter_2 = "0x0000000000000000000000009026A229b535ecF0162Dfe48fDeb3c75f7b2A7AE"
          let ping = {
            ping: false,
            message: "Large Aave Depostor Just Withdrew Funds",
            subject: "New activity alert"
          }

          if(data.to_address !== to_filter.toLowerCase()){
            return ping;
          }

        if(!data.successful){
            return ping
        }

          for(const i of data.log_events){
              if(i.raw_log_topics[0] === raw_log_topics_filter_1.toLowerCase()){
                  if(i.raw_log_topics[2] === raw_log_topics_filter_2.toLowerCase()){
                      ping.ping = true;
                      break;
                  }
              }
          }

          return ping;
      }
  }, 
  {
    "id": 3,
    "name": "CQT Transfer Signal: Nomad Bridge Hacker",
    "endpoint":  endpoint.transactions_v3,
    "payload" : [
      {
        address: "0x56D8B635A7C88Fd1104D23d632AF40c1C3Aac4e3", // Hacked Nomad Bridge for millions of dollars in CQT. Stills holds all of his CQT.
        chainName: "eth-mainnet"
      }

    ],
    "email": {
      "active": true,
      "to": ["test@email.com"]
    },
      "telegram": {
        "active" : true
      },
    "filter": (data: any) => {
        const raw_log_topics_filter_1 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        const raw_log_topics_filter_2 = "0x00000000000000000000000056D8B635A7C88Fd1104D23d632AF40c1C3Aac4e3"
        const raw_log_topics_filter_3 = "0x000000000000000000000000D417144312DbF50465b1C641d016962017Ef6240"
        let ping = {
          ping: false,
          message: "CQT Transfer: Nomad Bridge Hacker",
          subject: "New activity alert"
      }

        if(!data.successful){
            return ping
        }

        for(const i of data.log_events){
            if(i.raw_log_topics[0] === raw_log_topics_filter_1.toLowerCase()){
              if(i.raw_log_topics[1] === raw_log_topics_filter_2.toLowerCase()){
                if(i.sender_address === raw_log_topics_filter_3.toLowerCase()){
                    ping.ping = true;
                    break;
                }
              }
            }
        }

        return ping;
    }
},
  ]
}
