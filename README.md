# Calorie Counter

A Telegram Mini App to keep track of your calorie intake easily.

The repository of the bot can be found in the following repository. (It can also be found in this repository inside calorie-counter-bot folder)
https://github.com/aeither/calorie-counter-bot

# DEMO

https://t.me/caloriecounterlive_bot

# Overview

@caloriecounterlive_bot – a Mini App that helps you track your daily calorie intake. The user is presented with an interface where they can select food items, adjust the amount, customize with more items to calculate the total calories, and finally add the result back to the chat.

# How it works

Open the bot. Run /start to open the keyboard. Tap on it to open the mini app. Choose foods from the most popular. Afterward, you can adjust the amount or remove them. 

Then you can customize with foods that are not on the list in the field after you confirm the initial items. By confirming the field, you will get the total calories, protein, fat, and carbs calculated from all the foods after a few seconds. 

At this point, you should be able to see a sticky blue button at the bottom to send the total back to the chat. In this way, you can keep track of your meal intake. The total calories will add up for the same day and reset for a new day.

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


# Instructions

Open BotFather and create a new bot.

Copy the bot token and go to the calorie-counter-bot repository to update the .env TELEGRAM_BOT_TOKEN with the token for local development and TELEGRAM_BOT_TOKEN_LIVE for production. You can choose to host it on whatever server you like. The server I used, which I also recommend, is Deno Deploy.
As a requirement, Deno should be installed on your system. To start local development, run the command "deno task dev". There is a script to set up the bot commands and a webhook for the live version. Open "scripts/index.ts," update it with your own URL, and run deno task commands. The current app it opens is mine. Update WEBAPP_URL inside src/bot.ts to yours.

When developing the calorie counter, ngrok can be used to expose the URL to the bot. Otherwise, deploy it to a server and update the URL to point to it correctly.


# Screenshots
![ChatBot](https://github.com/aeither/calorie-counter/assets/36173828/0a866086-2a94-4864-a6a6-92aef7290bb2)

![ui-2](https://github.com/aeither/calorie-counter/assets/36173828/3c01ea8d-2f92-4dd1-8f20-aa6e3c5f07b5)

![ui-1](https://github.com/aeither/calorie-counter/assets/36173828/705b850b-32eb-4af7-83ef-a7a66b7aebcd)
