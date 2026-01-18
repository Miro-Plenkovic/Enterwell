"use client";
import { useEffect, useState } from "react";
import {
  getRecipeDetails,
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  RecipeDetailsRequest,
  RecipeDetailsResponse,
  RecipeResponse,
} from "./apiCalls";
import { ToastContainer, toast } from "react-toastify";
import SideBar from "./lib/sidebar";
import RecipeList from "./lib/recipeList";
import RecipeDetails from "./lib/recipeDetails";
import RecipeForm from "./lib/recipeForm";
import Filter from "./lib/filter";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "./page.css";
import { Button } from "@mui/material";

export type FilterData = {
  filterValue: string;
  difficulty: number;
  howToPrep: number;
  mealType: number;
};

export default function Home() {
  const [activeRecipe, setActiveRecipe] =
    useState<RecipeDetailsResponse | null>(null);
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [newRecipeForm, setNewRecipeForm] = useState<Boolean>(false);
  const [filter, setFilter] = useState<Boolean>(false);
  const [filterData, setFilterData] = useState<FilterData | undefined>(
    undefined,
  );
  useEffect(() => {
    getRecipes(filterData)
      .then((d) => {
        setRecipes(d);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }, [filterData]);

  function getDetails(r: RecipeResponse) {
    getRecipeDetails(r.id)
      .then((d) => {
        setActiveRecipe(d);
        console.log(d);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }
  function createNewRecipe(r: RecipeDetailsRequest) {
    createRecipe(r)
      .then((d) => {
        getRecipes(filterData)
          .then((dd) => {
            setRecipes(dd);
            toast.success("new recipe created");
          })
          .catch((e: unknown) => {
            toast.error(e instanceof Error ? e.message : String(e));
          });
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }

  function updateExistingRecipe(r: RecipeDetailsRequest) {
    updateRecipe(r)
      .then((d) => {
        getRecipes(filterData)
          .then((dd) => {
            setRecipes(dd);
            toast.success("recipe updated");
          })
          .catch((e: unknown) => {
            toast.error(e instanceof Error ? e.message : String(e));
          });
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }

  function createOrUpdateRecipe(r: RecipeDetailsRequest) {
    if (r.id !== undefined) {
      updateExistingRecipe(r);
    } else {
      createNewRecipe(r);
    }
  }

  function deleteActiveRecipe() {
    if (activeRecipe != null)
      deleteRecipe(activeRecipe)
        .then((d) => {
          getRecipes(filterData)
            .then((dd) => {
              setRecipes(dd);
              toast.success("recipe deleted");
              setActiveRecipe(null);
            })
            .catch((e: unknown) => {
              toast.error(e instanceof Error ? e.message : String(e));
            });
        })
        .catch((e: unknown) => {
          toast.error(e instanceof Error ? e.message : String(e));
        });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ToastContainer></ToastContainer>
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {!newRecipeForm ? (
          activeRecipe == null ? (
            <Box width="100%" sx={{ flexGrow: 1 }}>
              <Filter
                active={filter}
                updateFilterData={(d: FilterData) => setFilterData(d)}
                setFilter={() => setFilter(false)}
              ></Filter>
              <Grid container spacing={2}>
                <Grid size={3}>
                  <Button style={{ zIndex: 3 }} onClick={() => setFilter(true)}>
                    Filter
                  </Button>
                </Grid>
                <Grid size={9}>
                  <Button
                    style={{ zIndex: 3 }}
                    onClick={() => setNewRecipeForm(true)}
                  >
                    Novi recept
                  </Button>
                </Grid>
                {recipes.map((rec, index) => {
                  return (
                    <Grid size={4}>
                      <RecipeList
                        key={index}
                        recipe={rec}
                        openThisRecipe={(r: RecipeResponse) => getDetails(r)}
                      ></RecipeList>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : (
            <RecipeDetails
              recipe={activeRecipe}
              updateButton={() => {
                setNewRecipeForm(true);
              }}
              deleteButton={() => {
                deleteActiveRecipe();
              }}
              backButton={() => setActiveRecipe(null)}
            ></RecipeDetails>
          )
        ) : (
          <RecipeForm
            recipe={activeRecipe}
            createNewRecipe={(r: RecipeDetailsRequest) =>
              createOrUpdateRecipe(r)
            }
            backButton={() => setActiveRecipe(null)}
          ></RecipeForm>
        )}

        <SideBar></SideBar>
      </main>
    </div>
  );
}
