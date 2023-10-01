import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { NutritionAnalysis, type FoodSearchResponse } from "@/lib/types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import WebApp from "@twa-dev/sdk";
import { MainButton } from "@twa-dev/sdk/react";
WebApp.ready();

const formSchema = z.object({
  ingredients: z.string(),
  notes: z.string(),
});

interface Item {
  id: number;
  name: string;
  quantity: number;
}

const initialItems: Item[] = [
  {
    id: 1,
    name: "Bread",
    quantity: 1, // grams
  },
  {
    id: 2,
    name: "Rice",
    quantity: 1,
  },
  {
    id: 3,
    name: "Tomato",
    quantity: 1,
  },
  {
    id: 4,
    name: "Apple",
    quantity: 1,
  },
  {
    id: 5,
    name: "Chicken",
    quantity: 1,
  },
  {
    id: 6,
    name: "Beef",
    quantity: 1,
  },
  {
    id: 7,
    name: "Pork",
    quantity: 1,
  },
  {
    id: 8,
    name: "Pasta",
    quantity: 1,
  },
];

async function getCalories(ingr: string) {
  const appId = import.meta.env.VITE_APPLICATION_ID as string | undefined;
  if (typeof appId !== "string") {
    console.log("appId is NOT string");
    return;
  }
  const appKey = import.meta.env.VITE_APPLICATION_KEYS as string | undefined;
  if (typeof appKey !== "string") {
    console.log("apiKey is NOT string");
    return;
  }

  const nutritionType = "cooking";
  // const ingr = "1 cup rice, 10 oz chickpeas";

  const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&nutrition-type=${nutritionType}&ingr=${ingr}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = (await response.json()) as NutritionAnalysis;
    console.log(data);
    // Process the response data here
    return data;
  } catch (error) {
    console.error(error);
    // Handle any errors here
  }
}

async function resetCounterIfNewDay() {
  const currentDate = new Date().toDateString();

  try {
    let storedDate: string | undefined;
    WebApp.CloudStorage.getItem("counterResetDate", (_, result) => {
      storedDate = result;
    });

    if (currentDate !== storedDate) {
      await WebApp.CloudStorage.setItem("counter", "0");
      await WebApp.CloudStorage.setItem("counterResetDate", currentDate);
    }
  } catch (error) {
    console.error("Error resetting counter:", error);
  }
}

async function incrementCounter(amount: string) {
  await resetCounterIfNewDay();

  try {
    let counter = "0";
    WebApp.CloudStorage.getItem("counter", (_, result) => {
      if (result) {
        counter = result;
        const newTotal = (+counter + +amount).toString();
        WebApp.CloudStorage.setItem("counter", newTotal.toString());
        return newTotal;
      }
    });
  } catch (error) {
    console.error("Error incrementing counter:", error);
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [cart, setCart] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartText, setCartText] = useState<string>("");
  const [nutritionString, setNutritionString] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const nutritionAnalysis = await getCalories(cartText);

    console.log("values:", values);
    console.log("calories: ");
    console.log(nutritionAnalysis);

    if (nutritionAnalysis) {
      const calories = nutritionAnalysis.calories;
      const todayCalories = await incrementCounter(calories.toString());

      // carb, protein, fat, calories
      const mapped = Object.entries(nutritionAnalysis.totalNutrientsKCal).map(
        ([key, value]) => ({
          label: value.label,
          quantity: value.quantity,
          unit: value.unit,
        })
      );

      let resultString = mapped
        .map((item) => `${item.label} ${item.quantity}${item.unit} \n`)
        .join("");

      resultString = `Today Total: ${todayCalories} \n` + resultString;

      console.log(resultString);

      WebApp.HapticFeedback.impactOccurred("medium");

      setNutritionString(resultString);
    }
  }

  async function mainButtonAction() {
    WebApp.HapticFeedback.impactOccurred("heavy");

    WebApp.sendData(nutritionString);
    WebApp.close();
  }

  // Ingredients
  const addToSelected = (item: Item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem.id === item.id
    );

    WebApp.HapticFeedback.impactOccurred("medium");

    if (existingItem) {
      existingItem.quantity++;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }

    setCart(updatedCart);
  };

  const reduceQuantity = (item: Item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity--;
    } else {
      const itemIndex = updatedCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (itemIndex !== -1) {
        updatedCart.splice(itemIndex, 1); // Remove the item from the cart if quantity is 1 or less
      }
    }

    setCart(updatedCart);
  };

  const increaseQuantity = (item: Item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      existingItem.quantity++;
    }

    setCart(updatedCart);
  };

  const removeItem = (item: Item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(updatedCart);
  };

  const handleExportCart = () => {
    const cartItemsText = cart
      .map((cartItem) => `${cartItem.quantity * 100}g ${cartItem.name}, `)
      .join("\n");

    WebApp.HapticFeedback.impactOccurred("medium");

    setCartText(cartItemsText);
    form.setValue("ingredients", cartItemsText);
  };

  // const handleSearch = async () => {
  //   try {
  //     //
  //     // setItems(calories);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <>
      {/* Telegram Main Button */}
      {nutritionString !== "" && (
        <MainButton
          text="Save to chat"
          onClick={() => {
            console.log("main button save");
            mainButtonAction();
            // WebApp.showPopup({
            //   message: "Pop up",
            //   buttons: [
            //     { id: "default", type: "default", text: "Confirm" },
            //     { id: "delete", type: "destructive", text: "Delete" },
            //     { id: "cancel", type: "cancel" },
            //   ],
            // });
          }}
        />
      )}

      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="p-4">
          <div className="space-y-2 pb-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              Calorie counter
            </h1>
            <p className="text-lg text-muted-foreground">
              <span className="display: inline-block; vertical-align: top; text-decoration: inherit; max-width: 340px;">
                Make sure you know how many calories you're eating
              </span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="ingredients"
                render={({}) => (
                  <FormItem>
                    <FormLabel>What have you eaten?</FormLabel>
                    <FormControl>
                      <>
                        {/* <div className="flex">
                          <Input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setSearchQuery(e.target.value)}
                          />
                          <Button
                            type="button"
                            onClick={async () => {
                              await handleSearch();
                            }}
                          >
                            Find
                          </Button>
                        </div> */}

                        {items.length > 0 && (
                          <>
                            <Card>
                              <CardHeader>
                                <CardTitle>Suggestions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="flex flex-col gap-1 pb-4">
                                  {items.map((item) => (
                                    <li
                                      className="flex w-full justify-between"
                                      key={item.id}
                                    >
                                      {item.name}
                                      <Button
                                        type="button"
                                        size={"sm"}
                                        variant={"outline"}
                                        onClick={() => addToSelected(item)}
                                      >
                                        Add
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                                <Separator />

                                <div className="pt-2">
                                  <p className="text-muted-foreground">
                                    Measured in 100g
                                  </p>
                                </div>

                                {/* List of items user can Increase, Reduce or Remove */}
                                <ul className="pt-4">
                                  {cart.map((cartItem) => (
                                    <li key={cartItem.id}>
                                      <p className="w-full truncate">
                                        {cartItem.quantity} {cartItem.name}
                                      </p>
                                      <div className="flex gap-1">
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            reduceQuantity(cartItem)
                                          }
                                          variant={"outline"}
                                        >
                                          -
                                        </Button>
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            increaseQuantity(cartItem)
                                          }
                                          variant={"outline"}
                                        >
                                          +
                                        </Button>
                                        <Button
                                          type="button"
                                          onClick={() => removeItem(cartItem)}
                                          variant={"destructive"}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>

                              <CardFooter>
                                <Button
                                  onClick={handleExportCart}
                                  type="button"
                                >
                                  Confirm Items
                                </Button>
                              </CardFooter>
                            </Card>

                            {/* List of items user can edit */}
                            <h2>Selected Items</h2>
                            <Textarea
                              value={cartText}
                              onChange={(e) => setCartText(e.target.value)}
                            />
                          </>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        // onChange={(e) => setInstructions(e.target.value)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <Button type="submit">Show calories</Button>

              <div className="space-y-2 pb-4">
                <p className="text-lg text-muted-foreground">
                  {nutritionString}
                </p>
              </div>
            </form>
          </Form>

          <div>
            <button
              onClick={() => {
                incrementCounter((100).toString());
              }}
            >
              increase
            </button>
            <button
              onClick={() => {
                WebApp.CloudStorage.getItem("counter", (_, result) => {
                  console.log("counter");
                  console.log(result);
                });
              }}
            >
              test
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
