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
import { type FoodSearchResponse } from "@/lib/types.ts";
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

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartText, setCartText] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIngredients] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Do something
  }

  // Ingredients

  const addToSelected = (item: Item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem.id === item.id
    );

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
      .map((cartItem) => `${cartItem.name} - Quantity: ${cartItem.quantity}`)
      .join("\n");
    setCartText(cartItemsText);
    setIngredients(cartItemsText);
    form.setValue("ingredients", cartItemsText);
  };

  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_USDA_API_KEY as string | undefined;
    if (typeof apiKey !== "string") {
      console.log("apiKey is NOT string");
      return;
    }
    const pageSize = 5;
    const pageNumber = 1;
    const dataType = "Foundation";
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchQuery}&api_key=${apiKey}&pageNumber=${pageNumber}&pageSize=${pageSize}&dataType=${dataType}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = (await response.json()) as FoodSearchResponse;
      const foodItems = data.foods.map((food) => ({
        id: food.fdcId,
        name: food.description,
        quantity: 0,
      }));
      setItems(foodItems);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Telegram Main Button */}
      <MainButton
        text="Save"
        onClick={() => {
          WebApp.sendData("value test");
          WebApp.close()
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

      <main className="flex min-h-screen flex-col items-center justify-center">
        <div>
          <div className="space-y-2 pb-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              Calorie counter
            </h1>
            <p className="text-lg text-muted-foreground">
              <span className="display: inline-block; vertical-align: top; text-decoration: inherit; max-width: 340px;">
                Short description
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
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <>
                        <div className="flex">
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
                        </div>

                        {items.length > 0 && (
                          <>
                            <Card>
                              <CardHeader>
                                <CardTitle>Choose</CardTitle>
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

                                <ul className="pt-4">
                                  {cart.map((cartItem) => (
                                    <li key={cartItem.id}>
                                      <p className="w-full truncate">
                                        {cartItem.name} x {cartItem.quantity}
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
                                  Confirm Ingredients
                                </Button>
                              </CardFooter>
                            </Card>
                            <h2>Ingredients</h2>
                            <Textarea value={cartText} readOnly />
                          </>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
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
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
}
