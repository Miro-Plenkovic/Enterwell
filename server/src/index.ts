import express from "express";
import cors from "cors";
import { createClient } from '@supabase/supabase-js'
import { Readable } from "node:stream";

require('dotenv').config()
const app = express();

enum Difficulty {
  Jednostavno,
  "Srednje zahtjevno",
  Složeno
}

enum HowToPrep {
  "Bez termičke obrade",
  Blanširanje,
  Kuhanje,
  Mariniranje,
  Pečenje,
  "Pečenje kolača i kruha",
  Pirjanje,
  Prženje
}

enum MealType {
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
  Zimnica
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In dev, your React app runs on http://localhost:3000
// This allows direct cross-origin calls if you choose to do them.
// (If you use Vite proxy, CORS won't even be necessary, but it's harmless.)
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.get("/api/images", async (_req, res) => {
  const upstream = await fetch((process?.env?.CDN_BASE_URL ?? "") + _req.query.image);
  if (!upstream.ok) {
    res.status(502).send("Upstream error");
  }

  res.set({
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/png",
      // browser + CDN caching for *your* endpoint:
      "Cache-Control": "public, max-age=31536000, immutable",
    }
  );

  Readable.fromWeb(upstream.body as any).pipe(res);
})

app.get("/api/ingredients", async (_req, res) => {
  let query = supabase.from("IngredientList").select("*").gt("hits", 5);
  const { data } = await query
  res.json(data?.map((el) => {
    return el;
  }));
});

app.get("/api/recipes", async (_req, res) => {
  let query = supabase.from("Recipes").select("*");
  if (_req.query.filterValue !== "undefined" && _req.query.filterValue !== "") query.ilike("name", `%${_req.query.filterValue}%`)
  if (_req.query.howToPrep !== "undefined" && _req.query.howToPrep !== "") query.eq("how_to_prep", _req.query.howToPrep)
  if (_req.query.mealType !== "undefined" && _req.query.mealType !== "") query.eq("meal_type", _req.query.mealType)
  if (_req.query.difficulty !== "undefined" && _req.query.difficulty !== "") query.eq("difficulty", _req.query.difficulty)
  const { data } = await query;
  res.json(data);
});

app.get("/api/recipes/:id", async (_req, res) => {
  let query = supabase.from("Recipes").select("*, Ingredients (id, description, name), Steps (id, title, body, step, image_link)").eq("id", _req.params.id);
  const { data } = await query
  if (data != null) res.json({ ...data[0],
    steps: data[0].Steps,
    ingredients: data[0].Ingredients
  });
  else{
      res.status(404).send("recipe does not exist");
    }
});

app.post("/api/recipes", async (_req, res) => {
  const { data } = await supabase
  .from('Recipes')
  .insert({ 
    name: _req.body.name,
    image: "/Images/" + _req.body.image + ".png",
    time_to_prep: _req.body.time_to_prep,
    portions: _req.body.portions,
    difficulty: _req.body.difficulty,
    how_to_prep: _req.body.how_to_prep,
    meal_type: _req.body.meal_type,
    description: _req.body.description
  } )
  .select('id')
  .single();

  await supabase
    .from('Ingredients')
    .insert(_req.body.ingredients.map((ing: any) => {return {recipeID: data?.id, description: ing.description, name: ing.name}}));

  await supabase
    .from('Steps')
    .insert(_req.body.steps.map((st: any) => {return {recipeID: data?.id, body: st.body, step: st.step}}));

  _req.body.ingredients.forEach(async (element: any) => {
    const { data } = await supabase.from("IngredientList").select("*").eq("name", element.name).single()
    if (data) await supabase.from("IngredientList").update({hits: data.hits + 1}).eq("name", element.name);
      else await supabase.from("IngredientList").insert({hits: 1, name: element.name}).eq("name", element.name);
  });

  res.json(data?.id ?? 1);
});

app.put("/api/recipes/:id", async (_req, res) => {
   const { data } = await supabase
  .from('Recipes')
  .update({ 
    name: _req.body.name,
    image: "/Images/" + _req.body.image + ".png",
    time_to_prep: _req.body.time_to_prep,
    portions: _req.body.portions,
    difficulty: _req.body.difficulty,
    how_to_prep: _req.body.how_to_prep,
    meal_type: _req.body.meal_type,
    description: _req.body.description
  } ).eq("id", _req.params.id)
  .select('id')
  .single();
  
  _req.body.ingredients.forEach(async (ing: any) => 
    await supabase
    .from('Ingredients')
    .update({recipeID: data?.id, description: ing.description, name: ing.name}).eq("id", ing.id));

  _req.body.steps.forEach(async (st: any) => 
    await supabase
    .from('Steps')
    .update({recipeID: data?.id, body: st.body, step: st.step}).eq("id", st.id));

  res.json(data?.id ?? 1);
});

app.delete("/api/recipes/:id", async (_req, res) => {
 const { data } = await supabase
  .from('Recipes')
  .delete().eq("id", _req.params.id)
  .select('id')
  .single();

  res.json(data?.id ?? 1);
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
