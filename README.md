# Calorie Counter

A Telegram Mini App to keep track of your calorie intake easily.

https://github.com/aeither/calorie-counter-bot

# DEMO

https://t.me/caloriecounterlive_bot

# Overview

The Calorie Counter is a telegram mini app that helps you track your daily calorie intake.

# How it works

Open the bot. Run /start to open the keyboard. Tap on it to open the mini app. Choose foods from most popular. Afterward you can adjust the amount or remove them. Then you can customize with foods that are not on the list in the field after you confirmed the initial items. By confirming the field, you will get the total calories, protein, fat and carbs calculated from all the foods after few seconds. At this point you should be able to see a sticky blue button at the bottom to send the total back to the chat, in this way you can keep track of you meal intake. The total calories will add up for the same day and reset for a new day.

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

Share data from mini app back to the chat.

```js
WebApp.close();
```

Store calories for the day

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


# Instructions

Open BotFather and create a new bot.
Copy the bot token and go to calorie-counter-bot repository to update the .env TELEGRAM_BOT_TOKEN with the token for local development and TELEGRAM_BOT_TOKEN_LIVE for production. The bot can be hosted in several provider. The server I used which I also recommend is Deno Deploy.
As requirement deno should be install with in your system. To start local development run the command "deno task dev". There is a script to setup the bot commands and the webhook for the live version. Open "scripts/index.ts" update it with your own url and run deno task commands. The current app it opens is mine. Update WEBAPP_URL Inside src/bot.ts to yours. 

When developing calorie-counter. ngrok can be used to expose the url to the bot. Otherwise deploy it to a server and update the url to point to it correctly.

# Screenshots
![ChatBot](https://github.com/aeither/calorie-counter/assets/36173828/0a866086-2a94-4864-a6a6-92aef7290bb2)

![ui-2](https://github.com/aeither/calorie-counter/assets/36173828/3c01ea8d-2f92-4dd1-8f20-aa6e3c5f07b5)

![ui-1](https://github.com/aeither/calorie-counter/assets/36173828/705b850b-32eb-4af7-83ef-a7a66b7aebcd)
