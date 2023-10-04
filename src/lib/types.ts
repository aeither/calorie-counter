// FoodSearchResponse

type FoodSearchCriteria = {
  query: string;
  dataType: string[];
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortOrder: string;
  brandOwner: string;
  tradeChannel: string[];
  startDate: string;
  endDate: string;
};

type FoodNutrient = {
  number: number;
  name: string;
  amount: number;
  unitName: string;
  derivationCode: string;
  derivationDescription: string;
};

export type Food = {
  fdcId: number;
  dataType: string;
  description: string;
  foodCode: string;
  foodNutrients: FoodNutrient[];
  publicationDate: string;
  scientificName: string;
  brandOwner: string;
  gtinUpc: string;
  ingredients: string;
  ndbNumber: number;
  additionalDescriptions: string;
  allHighlightFields: string;
  score: number;
};

export type FoodSearchResponse = {
  foodSearchCriteria: FoodSearchCriteria;
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: Food[];
};

// Edamam Nutrition Analysis

interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}

interface Ingredient {
  text: string;
  parsed: {
    quantity: number;
    measure: string;
    foodMatch: string;
    food: string;
    foodId: string;
    weight: number;
    retainedWeight: number;
    nutrients: Record<string, Nutrient>;
  }[];
  measureURI: string;
  status: string;
}

interface TotalNutrients {
  [key: string]: Nutrient;
}

interface TotalDaily {
  [key: string]: Nutrient;
}

interface TotalNutrientsKCal {
  [key: string]: Nutrient;
}

export interface NutritionAnalysis {
  uri: string;
  calories: number;
  totalCO2Emissions: number;
  co2EmissionsClass: string;
  totalWeight: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  totalNutrients: TotalNutrients;
  totalDaily: TotalDaily;
  ingredients: Ingredient[];
  totalNutrientsKCal: TotalNutrientsKCal;
}

// List item

export interface Item {
  id: number;
  name: string;
  quantity: number;
}
