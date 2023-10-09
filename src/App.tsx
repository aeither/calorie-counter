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
import { Separator } from "@/components/ui/separator.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Item } from "@/lib/types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import WebApp from "@twa-dev/sdk";
import { MainButton } from "@twa-dev/sdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { initialItems } from "./lib/data";
import { getCalories } from "./lib/utils";
WebApp.ready();

const formSchema = z.object({
  ingredients: z.string(),
  notes: z.string(),
});

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

  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.getItem("counter", (_, result) => {
      if (result) {
        const counter = result;
        const newTotal = (+counter + +amount).toString();

        WebApp.CloudStorage.setItem("counter", newTotal.toString(), () => {
          console.log("Counter incremented. New total:", newTotal);
          resolve(newTotal);
        });
      } else {
        reject("Counter not found");
      }
    });
  });
}

export default function Home() {
  const [items, _] = useState<Item[]>(initialItems);
  const [cart, setCart] = useState<Item[]>([]);
  const [cartText, setCartText] = useState<string>("");
  const [nutritionString, setNutritionString] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const nutritionAnalysis = await getCalories(cartText);

    console.log("calories: ");
    console.log(nutritionAnalysis);

    if (nutritionAnalysis) {
      WebApp.HapticFeedback.impactOccurred("medium");

      const calories = nutritionAnalysis.calories;
      const todayCalories = await incrementCounter(calories.toString());

      // map carb, protein, fat, calories
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

      setNutritionString(resultString);
    }
  }

  async function sendData2Chat() {
    WebApp.HapticFeedback.impactOccurred("heavy");

    WebApp.sendData(nutritionString);
    WebApp.close();
  }

  const addToSelected = (item: Item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem.id === item.id
    );

    WebApp.HapticFeedback.impactOccurred("light");

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
        updatedCart.splice(itemIndex, 1);
      }
    }

    WebApp.HapticFeedback.impactOccurred("light");
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

    WebApp.HapticFeedback.impactOccurred("light");
    setCart(updatedCart);
  };

  const removeItem = (item: Item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);

    WebApp.HapticFeedback.impactOccurred("medium");
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

  return (
    <>
      {/* Send data back to Chat */}
      {nutritionString !== "" && (
        <MainButton
          text="Save to chat"
          onClick={() => {
            sendData2Chat();
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

              <Button type="submit">Show calories</Button>

              <div className="space-y-2 pb-4">
                <p className="text-lg text-muted-foreground">
                  {nutritionString}
                </p>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
}
