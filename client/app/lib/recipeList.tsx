import Image from "next/image";
import { RecipeResponse } from "../apiCalls";
import { Difficulty, MealType, HowToPrep } from "./recipeForm";

export type RecipeListProps = {
  recipe: RecipeResponse;
  openThisRecipe: (r: RecipeResponse) => void;
};

export default function RecipeList(props: RecipeListProps) {
  return (
    <div>
      <Image
        className="dark:invert"
        src={props.recipe?.image ?? ""}
        alt="recipe image"
        width={100}
        height={20}
        priority
        onClick={() => props.openThisRecipe(props.recipe)}
      />
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        {props.recipe?.name ?? ""}
      </div>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        {props.recipe?.description ?? ""}
      </div>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        {Difficulty[props.recipe?.difficulty ?? 0]}
      </div>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        {HowToPrep[props.recipe?.how_to_prep ?? 0]}
      </div>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        {MealType[props.recipe?.meal_type ?? 0]}
      </div>
    </div>
  );
}
