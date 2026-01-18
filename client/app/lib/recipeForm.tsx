import Image from "next/image";
import {
  RecipeResponse,
  RecipeDetailsResponse,
  RecipeDetailsRequest,
  Ingredients,
  Steps,
  IngredientResponse,
  getIngredients,
} from "../apiCalls";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

const zod = require("zod");

export type RecipeFormProps = {
  recipe: RecipeDetailsResponse | null;
  createNewRecipe: (r: RecipeDetailsRequest) => void;
  backButton: () => void;
};

export enum Difficulty {
  Jednostavno,
  "Srednje zahtjevno",
  Složeno,
}

export enum HowToPrep {
  "Bez termičke obrade",
  Blanširanje,
  Kuhanje,
  Mariniranje,
  Pečenje,
  "Pečenje kolača i kruha",
  Pirjanje,
  Prženje,
}

export enum MealType {
  "Hladno predjelo",
  "Toplo predjelo",
  "Kruh i peciva",
  Juhe,
  "Umaci, dipovi, preljevi",
  Salate,
  "Glavna jela",
  "Prilozi i variva",
  Deserti,
  Pića,
  Zimnica,
}

const imageOptions = [
  { value: "Potato", label: "Krumpir" },
  { value: "Tomato", label: "Rajčica" },
  { value: "Onion", label: "Luk" },
  { value: "Flour", label: "Brašno" },
];

const recipeSchema = zod.object({
  name: zod.string(),
  how_to_prep: zod.number(),
  difficulty: zod.number(),
  meal_type: zod.number(),
  description: zod.string(),
  time_to_prep: zod.number(),
  image: zod.string(),
  portions: zod.number(),
});

type FormResult = {
  name: string | undefined;
  description: string | undefined;
  image: string | undefined;
  time_to_prep: number | undefined;
  portions: number | undefined;
  difficulty: number | undefined;
  how_to_prep: number | undefined;
  meal_type: number | undefined;
  ingredients: Ingredients[] | undefined;
  steps: Steps[] | undefined;
};

export default function RecipeForm(props: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [numberOfSteps, setNumberOfSteps] = useState<number>(
    props.recipe?.steps?.length ?? 1,
  );
  const [numberOfIngredients, setNumberOfIngredients] = useState<number>(
    props.recipe?.ingredients?.length ?? 1,
  );
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      difficulty: props.recipe?.difficulty,
      ingredients: props.recipe?.ingredients,
      steps: props.recipe?.steps,
      name: props.recipe?.name,
      description: props.recipe?.description,
      image: imageOptions.find((img) => props.recipe?.image.includes(img.value))
        ?.value,
      time_to_prep: props.recipe?.time_to_prep,
      how_to_prep: props.recipe?.how_to_prep,
      meal_type: props.recipe?.meal_type,
      portions: props.recipe?.portions,
    },
  });
  useEffect(() => {
    getIngredients()
      .then((d) => {
        setIngredients(d);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }, []);

  const onSubmit = (data: FormResult) => {
    try {
      const recipe: RecipeDetailsRequest = {
        id: props.recipe?.id,
        name: data.name ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
        how_to_prep: data.how_to_prep ?? 0,
        meal_type: data.meal_type ?? 0,
        portions: data.portions ?? 1,
        time_to_prep: data.time_to_prep ?? 10,
        difficulty: data.difficulty ?? 0,
        steps:
          data?.steps?.map((step, index) => {
            return { id: step.id, body: step.body, step: index + 1 };
          }) ?? [],
        ingredients:
          data?.ingredients?.map((ing) => {
            return {
              id: ing.id,
              description: ing.description,
              name: ing.name,
            };
          }) ?? [],
      };
      recipeSchema.parse(recipe);

      props.createNewRecipe(recipe);
    } catch (e) {
      toast.error(e instanceof TypeError ? e.message : String(e));
    }
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ top: "10px", position: "absolute" }}>
          Osnovno
          <label style={{ top: "20px", position: "absolute" }}>
            Naziv recepta
            <input
              style={{ backgroundColor: "#EEE" }}
              {...register("name")}
              type="text"
              name="name"
            ></input>
          </label>
          <label style={{ top: "100px", position: "absolute" }}>
            Uvod
            <input
              style={{ backgroundColor: "#EEE" }}
              {...register("description")}
              width="90%"
              type="text"
              name="description"
            ></input>
          </label>
        </div>
        <div style={{ top: "170px", position: "absolute" }}>
          Sastojci
          {numberOfIngredients > 1 ? (
            <Button
              style={{ top: `20px`, position: "absolute" }}
              onClick={() => setNumberOfIngredients(numberOfIngredients - 1)}
            >
              -
            </Button>
          ) : undefined}
          <table width={"60%"}>
            {[...Array(numberOfIngredients)].map((v, index) => {
              return (
                // <div
                //   style={{ top: `${70 + 120 * index}px`, position: "absolute" }}
                //   key={index}
                // >
                <tr>
                  <td style={{ width: "40px", position: "absolute" }}>
                    <label>
                      Opis{" "}
                      <input
                        style={{ backgroundColor: "#EEE" }}
                        {...register(
                          `ingredients.${index}.description` as const,
                        )}
                        type="text"
                        name={`ingredients.${index}.description`}
                      ></input>
                      <input
                        hidden
                        {...register(`ingredients.${index}.id` as const)}
                        type="text"
                        name={`ingredients.${index}.id`}
                      ></input>
                    </label>
                  </td>
                  <td
                    style={{
                      width: "200px",
                      left: "240px",
                      position: "absolute",
                    }}
                  >
                    <label>
                      Sastojak{" "}
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <CreatableSelect
                            defaultValue={{
                              value: field.value?.toString(),
                              label: field.value?.toString(),
                            }}
                            onChange={(val) => field.onChange(val?.value)}
                            options={ingredients.map((ing) => {
                              return { value: ing.name, label: ing.name };
                            })}
                          ></CreatableSelect>
                        )}
                        name={`ingredients.${index}.name`}
                      />
                    </label>
                  </td>
                </tr>

                // </div>
              );
            })}
          </table>
          <Button
            style={{
              top: `${70 + 120 * numberOfIngredients}px`,
              position: "absolute",
            }}
            onClick={() => setNumberOfIngredients(numberOfIngredients + 1)}
          >
            +
          </Button>
        </div>
        <div
          style={{
            top: `${350 + 120 * numberOfIngredients}px`,
            position: "absolute",
          }}
        >
          Koraci
          {numberOfSteps > 1 ? (
            <Button
              style={{
                top: `20px`,
                position: "absolute",
              }}
              onClick={() => setNumberOfSteps(numberOfSteps - 1)}
            >
              -
            </Button>
          ) : undefined}
          {[...Array(numberOfSteps)].map((v, index) => {
            return (
              <div
                style={{
                  top: `${70 + 70 * index}px`,
                  position: "absolute",
                }}
                key={index}
              >
                <label>
                  Opis{" "}
                  <input
                    style={{ backgroundColor: "#EEE" }}
                    {...register(`steps.${index}.body` as const)}
                    type="text"
                    name={`steps.${index}.body`}
                  ></input>
                  <input
                    hidden
                    {...register(`steps.${index}.body` as const)}
                    type="text"
                    name={`steps.${index}.id`}
                  ></input>
                </label>
              </div>
            );
          })}
          <Button
            style={{
              top: `${70 + 70 * numberOfSteps}px`,
              position: "absolute",
            }}
            onClick={() => setNumberOfSteps(numberOfSteps + 1)}
          >
            +
          </Button>
        </div>
        <div style={{ top: "120px", right: "20px", position: "absolute" }}>
          <label>
            {" "}
            Trajanje pripreme:
            <label>
              (u minutama)
              <input
                style={{ backgroundColor: "#EEE" }}
                {...register(`time_to_prep`, { valueAsNumber: true })}
                type="number"
                name={`time_to_prep`}
              ></input>
            </label>
          </label>
        </div>
        <div style={{ top: "190px", right: "20px", position: "absolute" }}>
          <label>
            {" "}
            Broj porcija:
            <input
              style={{ backgroundColor: "#EEE" }}
              {...register(`portions`, { valueAsNumber: true })}
              type="number"
              name={`portions`}
            ></input>
          </label>
        </div>
        <div style={{ top: "260px", right: "20px", position: "absolute" }}>
          <label>
            {" "}
            Slika:
            <Controller
              control={control}
              render={({ field }) => (
                <Select
                  options={imageOptions}
                  onChange={(val) => field.onChange(val?.value)}
                  defaultValue={imageOptions.find((img) =>
                    field?.value?.includes(img.value),
                  )}
                ></Select>
              )}
              name={`image`}
            />
          </label>
        </div>
        <div style={{ top: "330px", right: "20px", position: "absolute" }}>
          <label>
            {" "}
            Težina pripreme:
            <Controller
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { value: "0", label: "Jednostavno" },
                    { value: "1", label: "Srednje zahtjevno" },
                    { value: "2", label: "Složeno" },
                  ]}
                  onChange={(val) =>
                    field.onChange(parseInt(val?.value ?? "0"))
                  }
                  defaultValue={{
                    value: field.value?.toString(),
                    label: Difficulty[field?.value ?? 0],
                  }}
                ></Select>
              )}
              name={`difficulty`}
            />
          </label>
        </div>
        <div style={{ top: "440px", right: "20px", position: "absolute" }}>
          <label>
            {" "}
            Grupa jela:
            <Controller
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue={{
                    value: field.value?.toString(),
                    label: MealType[field?.value ?? 0],
                  }}
                  onChange={(val) =>
                    field.onChange(parseInt(val?.value ?? "0"))
                  }
                  options={[
                    { value: "0", label: "Hladno predjelo" },
                    { value: "1", label: "Toplo predjelo" },
                    { value: "2", label: "Kruh i peciva" },
                    { value: "3", label: "Juhe" },
                    { value: "4", label: "Umaci, dipovi, preljevi" },
                    { value: "5", label: "Salate" },
                    { value: "6", label: "Glavna jela" },
                    { value: "7", label: "Prilozi i variva" },
                    { value: "8", label: "Deserti" },
                    { value: "9", label: "Pića" },
                    { value: "10", label: "Zimnica" },
                  ]}
                ></Select>
              )}
              name={`meal_type`}
            />
          </label>
        </div>
        <div style={{ top: "550px", right: "20px", position: "absolute" }}>
          <label>
            {" "}
            Način pripreme:
            <Controller
              control={control}
              render={({ field }) => (
                <Select
                  defaultValue={{
                    value: field.value?.toString(),
                    label: HowToPrep[field?.value ?? 0],
                  }}
                  onChange={(val) =>
                    field.onChange(parseInt(val?.value ?? "0"))
                  }
                  options={[
                    { value: "0", label: "Bez termičke obrade" },
                    { value: "1", label: "Blanširanje" },
                    { value: "2", label: "Kuhanje" },
                    { value: "3", label: "Mariniranje" },
                    { value: "4", label: "Pečenje" },
                    { value: "5", label: "Pečenje kolača i kruha" },
                    { value: "6", label: "Pirjanje" },
                    { value: "7", label: "Prženje" },
                  ]}
                ></Select>
              )}
              name={`how_to_prep`}
            />
          </label>
        </div>
        <div style={{ top: "20px", right: "20px", position: "absolute" }}>
          <input type="submit" value="Submit" />
        </div>
      </form>
      <button
        style={{
          top: `${500 + 100 * numberOfIngredients + 100 * numberOfSteps}px`,
          position: "absolute",
        }}
        onClick={() => props.backButton()}
      >
        Back
      </button>
    </div>
  );
}
