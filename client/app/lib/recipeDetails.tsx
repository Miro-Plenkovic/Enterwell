import Image from "next/image";
import { RecipeDetailsResponse } from "../apiCalls";
import { Difficulty, MealType, HowToPrep } from "./recipeForm";
import { Button } from "@mui/material";

export type RecipeDetailsProps = {
  recipe: RecipeDetailsResponse;
  updateButton: () => void;
  deleteButton: () => void;
  backButton: () => void;
};

export default function RecipeDetails(props: RecipeDetailsProps) {
  return (
    <div style={{ width: "80%" }}>
      <div style={{ top: "10px", width: "100%", position: "absolute" }}>
        Osnovno{" "}
        <label style={{ top: "40px", width: "100%", position: "absolute" }}>
          Naziv recepta <label>{props.recipe.name}</label>
        </label>
        <label style={{ top: "80px", width: "100%", position: "absolute" }}>
          Uvod <label>{props.recipe.description}</label>
        </label>
      </div>
      <div style={{ top: "200px", position: "absolute" }}>
        Sastojci{" "}
        {[...Array(props.recipe.ingredients.length)].map((v, index) => {
          return (
            <div
              style={{ top: `${30 + 100 * index}px`, position: "absolute" }}
              key={index}
            >
              <label>
                Opis{" "}
                <label>{props.recipe.ingredients[index].description}</label>
              </label>
              <label>
                Naziv <label>{props.recipe.ingredients[index].name}</label>
              </label>
            </div>
          );
        })}
      </div>
      <div
        style={{
          top: `${230 + 100 * props.recipe.ingredients.length}px`,
          position: "absolute",
        }}
      >
        Koraci{" "}
        {[...Array(props.recipe.steps.length)].map((v, index) => {
          return (
            <div
              style={{
                top: `${70 + 70 * index}px`,
                position: "absolute",
              }}
              key={index}
            >
              <label>
                Opis <label>{props.recipe.steps[index].body}</label>
              </label>
            </div>
          );
        })}
      </div>
      <div
        style={{
          top: `${350 + 100 * props.recipe.ingredients.length + 80 * props.recipe.steps.length}px`,
          position: "absolute",
        }}
      >
        <Button onClick={() => props.backButton()}>Nazad</Button>
        <Button onClick={() => props.updateButton()}>Izmijeni</Button>
        <Button onClick={() => props.deleteButton()}>Izbriši</Button>
      </div>
      <div style={{ top: "120px", right: "20px", position: "absolute" }}>
        <label>
          {" "}
          Trajanje pripreme:
          <label>
            (u minutama )<label>{props.recipe.time_to_prep}</label>
          </label>
        </label>
      </div>
      <div style={{ top: "190px", right: "20px", position: "absolute" }}>
        <label>
          {" "}
          Broj porcija: <label>{props.recipe.portions}</label>
        </label>
      </div>
      <div style={{ top: "230px", left: "800px", position: "absolute" }}>
        <label>
          <Image
            className="dark:invert"
            src={`/api/images?image=${props.recipe.image}`}
            alt="recipe image"
            width={100}
            height={20}
            priority
          />
        </label>
      </div>
      <div style={{ top: "330px", right: "20px", position: "absolute" }}>
        <label>
          {" "}
          Težina pripreme: <label>{Difficulty[props.recipe.difficulty]}</label>
        </label>
      </div>
      <div style={{ top: "440px", right: "20px", position: "absolute" }}>
        <label>
          {" "}
          Grupa jela: <label>{MealType[props.recipe.meal_type]}</label>
        </label>
      </div>
      <div style={{ top: "550px", right: "20px", position: "absolute" }}>
        <label>
          {" "}
          Način pripreme: <label>{HowToPrep[props.recipe.how_to_prep]}</label>
        </label>
      </div>
    </div>
  );
}
