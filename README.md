
# Covalent Vercel Postgres Next.js Starter

## Project Setup

### Setting up vercel environment variables

1. Visit the Covalent website:
[Sign in or create a new account](https://www.covalenthq.com/platform).
Generate an API key in your account settings.
Note down the generated API key.

**Setting up both telegram and email is optional but choosing atleast one is mandatory**

2. Obtain Telegram bot ID and chat ID: Create a new Telegram bot by following the official Telegram Bot [documentation](https://core.telegram.org/bots/api). Retrieve the bot ID and chat ID. Note down these values.

2. Obtain Mailgun Key and domain: [Sign in or create a new account](https://www.mailgun.com/). Retrieve mailgun key and domain after setting up an account.

3. Click the deploy vercel button and follow the steps to deploy the project using these variables.

4. When filling telegram or mailgun environment vairables, fill the input with `""` if you choose not to use it.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnguyenlejoe%2Fcovalent-wallet-watcher&env=API_KEY,TELEGRAM_CHAT_ID,TELEGRAM_BOT_ID,MAILGUN_KEY,MAILGUN_DOMAIN&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D)

```
API_KEY=<your_covalent_api_key>
TELEGRAM_CHAT_ID=<your_telegram_chat_id>
TELEGRAM_BOT_ID=<your_telegram_bot_id>
MAILGUN_KEY=<your_mailgun_api_key>
MAILGUN_DOMAIN=<your_mailgun_domain>
```


## How to run the application

```
git clone <repo>
```

1. Install dependencies.
```
yarn
```

2. Connect your project to vercel's database.

```
vercel link
```

3. Pull environment variables into project.
```
vercel env pull .env
```

4. Configure your application settings in `config.ts`

5. Run project.
```
yarn run dev
```

## Configuring your project

In the `config.ts` file, you can define an array of alerts. Each alert can have multiple addresses to watch for a specific case. Each alert also has a `filter` function field where you can add your own logic. This function takes in a transaction object response and determines if it matches the desired criteria.

1. Configure Alerts: Edit the `config.ts` file to define your alerts. Each alert should include the addresses to watch and the filter function that determines the matching criteria.

2. Choosing either telegram and or mailgun: the `active` field is to disable or enable messaging for each alert

3. Define Cron Time: Open the `vercel.json` file and set the cron time. The example is set to run every day, but you can adjust it according to your requirements.

```
"schedule": "0 0 * * *"
```

4. Deploy Project: Push your changes to the main branch and deploy the project using the Vercel platform.

5. Enable Cron Job: Go to your project settings in Vercel and locate the option to enable the cron job. Turn it on to start the scheduled processing based on the defined cron time.

Start adding alerts and address you would like to watch and add filters and functions to send messages to your telegram bot / email



```
export const config = {
  "alerts": [
    {
        "id": 1,
        "name": "first alert",
        "addresses" : [
            "0x9507c04B10486547584C37bCBd931B2a4FeE9A41"
        ],
        "email": {
          "active": true,
          "to": ["test.com"],
          "subject": "New activity alert"
        },
        "telegram": {
          "active" : true
        },
        "message": "Jump Trading Activity",
        "filter": (data: any) => {
            const to_filter = "0x9507c04B10486547584C37bCBd931B2a4FeE9A41";
            const raw_log_topics_filter_1 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
            const raw_log_topics_filter_2 = "0x0000000000000000000000009507c04B10486547584C37bCBd931B2a4FeE9A41"
            let ping = false;

            if(!data.successful){
              return ping
            }

            if(data.to_address !== to_filter.toLowerCase()){
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
```

Try running the cron endpoint locally to see results.
```
http://localhost:3000/api/wallets/transactions
```


## Examples
The config.ts file houses several practical examples to guide you in crafting alerts. Here’s a summary of each:

#### Example 1 ("id": 1):
Purpose: Monitors large-scale trades on Uniswap V3 by a highly active MEV Bot.
Details: Filters based on the topic0 in raw_log_topics array matching the Uniswap V3 Swap event hash. Observing this wallet's trades can offer insights into arbitrage or trading windows.

#### Example 2 ("id": 2):
Purpose: Observes Aave Liquidation events for a wallet holding a WETH Debt of $10M.
Details: Filters by the topic0 in raw_log_topics array that corresponds to the Aave Liquidation event hash. Monitoring significant liquidations from this wallet might hint at potential risks in lending platforms, increased selling pressure on the liquidated collateral, or potential cascading liquidation events.

#### Example 3 ("id": 3):
Purpose: Tracks $CQT Transfers from the wallet implicated in the Nomad Bridge hack.
Details: Filters transactions using topic0 in the raw_log_topics array matching the universal Transfer event hash. Observing this wallet's movements is vital for investors, given its possession of a sizable chunk of the circulating supply. Any substantial sale of tokens by this wallet could dramatically influence the token's market value.




