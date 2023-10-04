import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { NutritionAnalysis } from "./types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getCalories(ingr: string) {
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
    return data;
  } catch (error) {
    console.error(error);
  }
}