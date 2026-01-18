import Image from "next/image";
import { RecipeResponse } from "../apiCalls";
import { Button } from "@mui/material";
import Select from "react-select";
import { FilterData } from "../page";

export type FilterProps = {
  active: Boolean;
  setFilter: () => void;
  updateFilterData: (d: FilterData) => void;
};

export default function Filter(props: FilterProps) {
  return (
    <div className={props.active ? "filter active" : "filter"}>
      <Button
        style={{
          zIndex: 3,
          color: "black",
          right: "10px",
          position: "absolute",
        }}
        onClick={() => props.setFilter()}
      >
        X
      </Button>
      <form
        onSubmit={(e: React.SyntheticEvent) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            filterValue: { value: string };
            difficulty: { value: number };
            howToPrep: { value: number };
            mealType: { value: number };
          };
          const filterValue = target.filterValue.value;
          const difficulty = target.difficulty.value;
          const howToPrep = target.howToPrep.value;
          const mealType = target.mealType.value;
          props.updateFilterData({
            filterValue,
            howToPrep,
            difficulty,
            mealType,
          });
        }}
      >
        <div style={{ top: "10px", position: "absolute" }}>
          <label>
            Filter by:
            <input width="90%" type="text" name="filterValue"></input>
          </label>
        </div>
        <div style={{ top: "70px", position: "absolute" }}>
          <label>
            {" "}
            Težina pripreme:
            <Select
              name="difficulty"
              options={[
                { value: "0", label: "Jednostavno" },
                { value: "1", label: "Srednje zahtjevno" },
                { value: "2", label: "Složeno" },
              ]}
            ></Select>
          </label>
        </div>
        <div style={{ top: "150px", position: "absolute" }}>
          <label>
            {" "}
            Grupa jela:
            <Select
              name="mealType"
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
          </label>
        </div>
        <div style={{ top: "230px", position: "absolute" }}>
          <label>
            {" "}
            Način pripreme:
            <Select
              name="howToPrep"
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
          </label>
        </div>
        <div style={{ top: "320px", position: "absolute" }}>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}
