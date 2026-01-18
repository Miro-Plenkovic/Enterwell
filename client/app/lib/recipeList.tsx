import Image from "next/image";
import { RecipeResponse } from "../apiCalls";
import { Difficulty, MealType, HowToPrep } from "./recipeForm";
import { useEffect, useState } from "react";

export type RecipeListProps = {
  recipe: RecipeResponse;
  openThisRecipe: (r: RecipeResponse) => void;
};

export default function RecipeList(props: RecipeListProps) {
  return (
    <div>
      <Image
        className="dark:invert"
        src={`/api/images?image=${props.recipe.image}`}
        alt="recipe image"
        width={100}
        height={20}
        priority
        onClick={() => props.openThisRecipe(props.recipe)}
      />
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        Naziv: {props.recipe?.name ?? ""}
      </div>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        Opis: {props.recipe?.description ?? ""}
      </div>
    </div>
  );
}
