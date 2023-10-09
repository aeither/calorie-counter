# Calorie Counter

A Telegram Mini App to keep track of your calorie intake easily.

https://github.com/aeither/calorie-counter-bot

# DEMO

https://t.me/caloriecounterlive_bot

# Overview

The Calorie Counter is a telegram mini app that helps you track your daily calorie intake.

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

# Screenshots
![ChatBot](https://github.com/aeither/calorie-counter/assets/36173828/0a866086-2a94-4864-a6a6-92aef7290bb2)

![ui-2](https://github.com/aeither/calorie-counter/assets/36173828/3c01ea8d-2f92-4dd1-8f20-aa6e3c5f07b5)

![ui-1](https://github.com/aeither/calorie-counter/assets/36173828/705b850b-32eb-4af7-83ef-a7a66b7aebcd)
