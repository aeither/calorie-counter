<div align="center">
    <img src="https://github.com/aeither/calorie-counter/assets/36173828/150dac35-bae7-4604-bdf6-e24e0001d065" alt="Logo" >
</div>

# Calorie Counter

A Telegram Mini App to keep track of your calorie intake easily.

The repository of the bot can be found in the following repository. (It can also be found in this repository inside calorie-counter-bot folder)
https://github.com/aeither/calorie-counter-bot

# DEMO

Watch the demo:

https://github.com/aeither/calorie-counter/assets/36173828/d5f32105-ac10-42c0-ada8-e559abe0089f

Try it out:

https://t.me/caloriecounterlive_bot

# Overview

@caloriecounterlive_bot – a Mini App that helps you track your daily calorie intake. The user is presented with an interface where they can select food items, adjust the amount, customize with more items to calculate the total calories, and finally add the result back to the chat.

# How it works

Open the bot. Run /start to open the keyboard. Tap on it to open the mini app. Choose foods from the most popular. Afterward, you can adjust the amount or remove them. 

Then you can customize with foods that are not on the list in the field after you confirm the initial items. By confirming the field, you will get the total calories, protein, fat, and carbs calculated from all the foods after a few seconds. 

At this point, you should be able to see a sticky blue button at the bottom to send the total back to the chat. In this way, you can keep track of your meal intake. The total calories will add up for the same day and reset for a new day.

# Instructions

Open @BotFather and create a new bot.
Copy the bot token and go to the calorie-counter-bot repository to update the .env TELEGRAM_BOT_TOKEN with the token for local development and TELEGRAM_BOT_TOKEN_LIVE for production. 

You can choose to host it on whatever server you like. The server I used, which I also recommend, is Deno Deploy.
As a requirement, Deno should be installed on your system. 

To start local development, run the command: 

```text 
deno task dev
```

There is a script to set up the bot commands and a webhook for the live version.
Open `scripts/index.ts` update it with your own URL, and run deno task commands. The current app it opens is mine. You should update `WEBAPP_URL` inside `src/bot.ts` to yours.

When developing the calorie counter, ngrok can be used to expose the URL to the bot. Otherwise, deploy it to a server and update the URL to point to it correctly.

# Feature Highlights

Track Calories: Log what you eat and drink each day.

Haptic feedback on button click.

```js
WebApp.HapticFeedback.impactOccurred("medium");
```

Share data from mini app back to the chat.

```js
WebApp.sendData(nutritionString);
```

Store calories for the day.

```js
WebApp.CloudStorage.getItem("counter", (_, result) => {
  if (result) {
    const counter = result;
    const newTotal = (+counter + +amount).toString();

    WebApp.CloudStorage.setItem("counter", newTotal.toString(), () => {
      resolve(newTotal);
    });
  } else {
    reject("Counter not found");
  }
});
```

Retrieve calories of the day so it can add up.

```js
WebApp.CloudStorage.setItem("counter", newTotal.toString(), () => {
  console.log("Counter incremented. New total:", newTotal);
  resolve(newTotal); // Resolve the promise with the new total
});
```

# Screenshots

![calorie-counter-1](https://github.com/aeither/calorie-counter/assets/36173828/0c9562d4-efc6-4a0e-aa84-e749b6372eab)

![calorie-counter-2](https://github.com/aeither/calorie-counter/assets/36173828/68788834-d9fd-4ea7-92c9-ee219741a423)

![calorie-counter-3](https://github.com/aeither/calorie-counter/assets/36173828/0c2af894-ae51-4f86-841a-5f8a51359cc5)

