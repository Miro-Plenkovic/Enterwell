import { FilterData } from "./page";

export type RecipeResponse = {
    id: number,
    created_at: Date,
    name: string,
    description: string,
    image: string,
    time_to_prep: number,
    portions: number,
    difficulty: number,
    how_to_prep: number,
    meal_type: number
  };

export type Steps = {
  id: number
  title: string,
  body: string,
  step: number,
  image_link: string
}

export type StepsRequest = {
  body: string,
  step: number
}

export type Ingredients = {
  id: number
  description: string,
  name: string
}

export type IngredientsRequest = {
  description: string,
  name: string
}

export type RecipeDetailsResponse = {
    id: number,
    created_at: Date,
    name: string,
    description: string,
    image: string,
    time_to_prep: number,
    portions: number,
    difficulty: number,
    how_to_prep: number,
    meal_type: number,
    steps: Steps[],
    ingredients: Ingredients[]
  };

  export type RecipeDetailsRequest = {
    id: number | undefined,
    name: string,
    description: string,
    image: string,
    time_to_prep: number,
    portions: number,
    difficulty: number,
    how_to_prep: number,
    meal_type: number,
    steps: StepsRequest[],
    ingredients: IngredientsRequest[]
  };

  export type IngredientResponse = {
    id: number,
    name: string,
    hits: number
  }

export async function getImage(image: string): Promise<RecipeResponse[]> {
    const res = await fetch(`/api/recipes?image=${image}`);
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

export async function getRecipes(filterData: FilterData | undefined): Promise<RecipeResponse[]> {
    const res = await fetch(`/api/recipes?filterValue=${filterData?.filterValue}&difficulty=${filterData?.difficulty}&howToPrep=${filterData?.howToPrep}&mealType=${filterData?.mealType}`);
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

export async function getIngredients(): Promise<IngredientResponse[]> {
    const res = await fetch(`/api/ingredients`);
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

export async function getRecipeDetails(id: number): Promise<RecipeDetailsResponse> {
    const res = await fetch(`/api/recipes/${id}`);
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

export async function createRecipe(r: RecipeDetailsRequest): Promise<number> {
    const res = await fetch(`/api/recipes`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...r})});
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

export async function updateRecipe(r: RecipeDetailsRequest): Promise<number> {
    const res = await fetch(`/api/recipes/${r.id}`, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...r})});
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

export async function deleteRecipe(r: RecipeDetailsRequest): Promise<number> {
    const res = await fetch(`/api/recipes/${r.id}`, {method: "DELETE", headers: {"Content-Type": "application/json"}});
    if (!res.ok) {
      if (res.status == 429) throw new Error("Too many requests");
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }