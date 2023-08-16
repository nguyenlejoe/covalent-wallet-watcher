
# Covalent Vercel Postgres Next.js Starter

## Project Setup

1. Obtain a Covalent API key. [Sign in or create a new account](https://www.covalenthq.com/platform). Generate an API key in your account settings. Note the generated API key.


2. Setup notifications. You can receive notifications by either a Telegram bot, or via email with Mailgun. Setting up both Telegram and Mailgun is optional, but you must use at least one.

    - **Telegram**: Obtain Telegram bot ID and chat ID: Create a new Telegram bot by using [Telegram's BotFather](https://core.telegram.org/bots/features#botfather). Note the token, this is your bot ID. For your chat ID, send a message to your bot using your mobile Telegram app, and then visit `https://api.telegram.org/bot<yourtoken>/getUpdates` in your browser. Note the chat ID in the response.

    - **Mailgun**: Obtain Mailgun key and domain: [Sign in or create a new account](https://www.mailgun.com/). Note your Mailgun key and domain after setting up an account.
   

3. Click the blue Vercel Deploy button below, and follow the steps to deploy the project using these variables.


4. When filling Telegram or Mailgun environment variables, fill the input with `""` if you choose not to use a particular service.


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnguyenlejoe%2Fcovalent-wallet-watcher&env=API_KEY,TELEGRAM_CHAT_ID,TELEGRAM_BOT_ID,MAILGUN_KEY,MAILGUN_DOMAIN&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D)

```
API_KEY=<your_covalent_api_key>
TELEGRAM_CHAT_ID= <your_telegram_chat_id> OR ""
TELEGRAM_BOT_ID= <your_telegram_bot_id> OR ""
MAILGUN_KEY= <your_mailgun_api_key> OR ""
MAILGUN_DOMAIN= <your_mailgun_domain> OR ""
```


## How to run the application

1. Install dependencies.
    ```
    yarn install
    ```

2. Install the Vercel CLI.
    ```
    yarn global add vercel
    ```
   
3. Connect your project to Vercel's database.

    ```
    vercel link
    ```

3. Pull environment variables into project.
 
    ```
    vercel env pull .env
    ```

4. Configure your application settings in `config.ts` (see below)

5. Run project.

    ```
    yarn run dev
    ```

## Configuring alerts and filters

In the `config.ts` file, you can define an array of filters and alerts. Each alert can have multiple addresses to watch for a specific case. Each alert also has a `filter` function field where you can add your own logic. This function takes in the api response object and determines if it matches the desired criteria.

Here's an example alert object:

 ```
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
 }
 ```


1. Choose the type of endpoint data to filter against: The type of endpoint your alert requests data to filter on should be within the `endpoint enum` type

    ```
    "endpoint": endpoint.transactions_v3
    ```
   Valid values for `endpoint enum` are:
   - transactions_v3
   - transactions_v2
   - balances_v2


2. Configure payload: Edit the `config.ts` file to define filters and alerts. Each alert should have a `payload` that includes the addresses and chain name to watch.

    ```
    "payload" : [
      {
        address: "0xA69BABEF1CA67A37FFAF7A485DFFF3382056E78C", // MEV Bot
        chainName: "eth-mainnet"
      }
    ]
    ```

3. Using Telegram or Mailgun: The `active` field is to disable or enable messaging for each alert.
 

4. Define a filter function: The filter function runs against the API response data your alert is defined for. You can adjust the filter criteria to your requirements and customize the message in this function.

    ```
    "filter": (data: any): ping => {
        let ping = {
          ping: false,
          message: "Successful ping",
          subject: "New activity alert"
        }

        if(data.successful){
            ping.ping = true
        }
        return ping;
    }
    ```


5. Define filter cron schedule: Open the `vercel.json` file and set the cron schedule. This example is set to run every day, the default for free Vercel Hobby accounts, but you can adjust it according to your requirements.

    ```
    "schedule": "0 0 * * *"
    ```

6. Deploy your project: Push your changes to the main branch and deploy the project using the Vercel platform.

7. Enable cron job: Go to your project settings in Vercel and locate the option to enable the cron job. Turn it on to start the scheduled processing based on the defined cron time.

8. Add additional filters and alerts: Add filters and alerts for addresses you would like to watch and receive notifications for.


9. Run the cron endpoint locally to see results.

    ```
    http://localhost:3000/api/wallets/alerts
    ```


## Examples
The config.ts file houses several practical examples to guide you in crafting alerts. Here’s a summary of each:

### Example 1 ("id": 1):
**Purpose:** Monitors trades on Uniswap V3 by a highly active and extremely large MEV Bot.

**Details:** Filters based on the ```topic0``` field in ```raw_log_topics``` array matching the Uniswap V3 Swap event hash. Observing this wallet's trades can offer insights into arbitrage or trading opportunities.

### Example 2 ("id": 2):
**Purpose:** Observes Aave Liquidation events for a wallet holding $10Ms in WETH Debt.

**Details:** Filters based on the ```topic0``` field in ```raw_log_topics``` array matching the Aave Liquidation event hash. Monitoring significant liquidations from this wallet might hint at potential risks in lending platforms, increased selling pressure on the liquidated collateral, or potential cascading liquidation events.

### Example 3 ("id": 3):
**Purpose:** Tracks $CQT Transfers from the wallet implicated in the [Nomad Bridge](https://www.theverge.com/2022/8/2/23288785/nomad-bridge-200-million-chaotic-hack-smart-contract-cryptocurrency) hack.

**Details:** Filters transactions using ```topic0``` in the ```raw_log_topics``` array matching the universal Transfer event hash. Observing this wallet's movements is vital for investors, given its possession of a sizable chunk of the circulating supply. Any substantial sale of tokens by this wallet could dramatically influence the token's market value.




