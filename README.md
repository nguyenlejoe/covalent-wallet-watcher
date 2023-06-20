
# Covalent Vercel Postgres Next.js Starter

## Project Setup

### Setting up vercel environment variables

#### *Visit the Covalent website:*
[Sign in or create a new account](https://www.covalenthq.com/platform).
Generate an API key in your account settings.
Note down the generated API key.

#### *Obtain Telegram bot ID and chat ID:*

Create a new Telegram bot by following the official Telegram Bot [documentation](https://core.telegram.org/bots/api).
Retrieve the bot ID and chat ID. Note down these values.

### One click deploy and apply environment vairables

```
API_KEY=<your_covalent_api_key>
TELEGRAM_CHAT_ID=<your_telegram_chat_id>
TELEGRAM_BOT_ID=<your_telegram_bot_id>
NEXT_PUBLIC_USER_NAME=<your_desired_username>
NEXT_PUBLIC_USER_PASSWORD=<your_desired_password>
CLIENT_SECRET=<your_desired_secret_key>
```

Click the deploy vercel button and follow the steps to deploy the project using these variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnguyenlejoe%2Fcovalent-wallet-watcher&env=API_KEY,TELEGRAM_CHAT_ID,TELEGRAM_BOT_ID,NEXT_PUBLIC_USER_NAME,NEXT_PUBLIC_USER_PASSWORD,CLIENT_SECRET&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D)


## How to run the application

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

Start adding alerts and address you would like to watch and add filters and functions to send messages to your telegram bot

```
export const config = {
  "alerts": [
    {
        "id": 1,
        "name": "example alert",
        "addresses" : [
            "0xF977814e90dA44bFA03b6295A0616a897441aceC",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        ],
        "filter": {},
        "function": (data: any) => {
            if(data.tx_hash === "0x336e1b01e8eeaf8bebef5233aa44eb71fca7939f10464e7ace95afbb9a46a554"){
              return true;
            }
        }
    }
  ]
}
```

