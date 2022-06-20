import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const RecipeSection = ({ recipes, setRecipes, handleDelete }) => {
  const handleView = (id) => {
    const recipesClone = [...recipes];

    recipesClone.forEach((recipe) => {
      recipe.id === id
        ? (recipe.viewing = !recipe.viewing)
        : (recipe.viewing = false);
    });

    setRecipes(recipesClone);
  };
  if (recipes.length === 0) {
    return (
      <div className="h-[300px] flex flex-col gap-2 items-center justify-center">
        <div className="w-[3rem] h-[3rem] border-4 border-slate-800 border-l-white rounded-full shadow animate-spin"></div>
        <p>Getting Recipes or No Recipe</p>
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 
    lg:grid-cols-3 mt-[2rem] gap-4"
    >
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          handleView={handleView}
          handleDelete={handleDelete}
          recipe={recipe}
        />
      ))}
    </div>
  );
};

const RecipeCard = ({ recipe, handleView, handleDelete }) => {
  return (
    <div
      className="rounded shadow hover:-translate-y-[0.2rem] 
    transition duration-300 bg-slate-700 px-4 py-5 flex flex-col gap-2"
    >
      <h3 className="font-bold text-xl">{recipe.title}</h3>
      <p>{recipe.desc}</p>

      {recipe.viewing && (
        <div className="flex mt-4 flex-col gap-1">
          <h2 className="text-emerald-300 font-bold uppercase ">Ingredients</h2>
          <ul className=" ml-4">
            {recipe.ingredients.map((ingredient, i) => (
              <li className="hover:list-disc" key={i}>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.viewing && (
        <div className="flex mt-4 flex-col gap-1">
          <h2 className="text-orange-500-300 font-bold uppercase ">
            Procedure
          </h2>
          <ol className="list-decimal ml-4">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="buttons flex gap-2 items-end justify-end">
        <button onClick={() => handleView(recipe.id)} className="view-btn">
          {recipe.viewing ? (
            <AiOutlineEyeInvisible />
          ) : (
            <AiOutlineEye className="text-xl" />
          )}
          View {recipe.viewing ? "less" : "more"}
        </button>
        <button onClick={() => handleDelete(recipe.id)} className="delete-btn">
          <p>Delete</p>
          <FaTrashAlt className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default RecipeSection;
