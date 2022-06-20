import { db } from "./firebase.config";
import { useState, useEffect, useRef } from "react";
import { 
  collection, 
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { RecipeSection } from "./components";
import ClickAwayListener from "react-click-away-listener";
import { MdClose } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
    createdAt: serverTimestamp()
  });
  const [popup, setPopup] = useState(false);
  const formRef = useRef();

  const recipesRef = collection(db, "recipes");

  const handleSubmit = (e) => {
    e.preventDefault();
    addDoc(recipesRef, form)
    .then(
      () => toast.success("Recipe added successfully")
    ).catch((err) => toast.error(err.message));
    setPopup(false);
    formRef.current.reset();
  };

  const handleDelete = (id) => {
    deleteDoc(doc(db, "recipes", id))
      .then(() => toast.success("Recipe deleted successfully"))
      .catch((err) => toast.error(err.message));
  }

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.ingredients];

    ingredientsClone[i] = e.target.value;
    setForm({ ...form, ingredients: ingredientsClone });
  };

  const handleStep = (e, i) => {
    const stepsClone = [...form.steps];

    stepsClone[i] = e.target.value;
    setForm({ ...form, steps: stepsClone });
  };

  const handleIngredientCount = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ""],
    });
  };

  const handleStepCount = () => {
    setForm({
      ...form,
      steps: [...form.steps, ""],
    });
  };

  useEffect(() => {
    onSnapshot(query(recipesRef, orderBy("createdAt","desc")), (snapshot) => {
      setRecipes(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            viewing: false,
            ...doc.data(),
          };
        })
      );
      console.log(recipes);
    });
  }, []);

  return (
    <div className="app">
      <Header setPopup={setPopup} />
      <RecipeSection recipes={recipes} handleDelete={handleDelete} setRecipes={setRecipes} />
      {popup && (
        <PopUp
          setPopup={setPopup}
          handleIngredient={handleIngredient}
          handleSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          handleIngredientCount={handleIngredientCount}
          handleStepCount={handleStepCount}
          handleStep={handleStep}
          formRef = {formRef}
        />
      )}
    </div>
  );
}

const Header = ({ setPopup }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="title">My Recipes</h1>
      <button
        onClick={() => setPopup(true)}
        className="bg-slate-700 btn-add hover:scale-105 active:scale-95 transition px-4 py-3 rounded-sm text-white"
      >
        Add recipe
      </button>
    </div>
  );
};

const PopUp = ({
  setPopup,
  setForm,
  form,
  handleSubmit,
  handleIngredient,
  handleIngredientCount,
  handleStep,
  handleStepCount,
  formRef
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center absolute bg-black/50 w-full z-30 top-0 left-0">
      <ClickAwayListener onClickAway={() => setPopup(false)}>
        <div className="popup-inner border-4 border-white relative flex flex-col gap-2 px-4 py-6 rounded rounded-tr-none w-full max-w-[90vw] sm:max-w-xs md:max-w-[400px] bg-slate-800 shadow z-40">
          <button
            onClick={() => setPopup(false)}
            className="absolute rounded-none rounded-bl-lg top-0 right-0 bg-white min-w-15 h-15"
          >
            <MdClose className="text-slate-900 text-3xl" />
          </button>
          <h2 className="font-bold text-2xl text-center mb-3">
            Add a new Recipe
          </h2>
          <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-2">
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label htmlFor="desc">Description</label>
              <textarea
                type="text"
                name="desc"
                id="desc"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
              />
            </div>

            <div className="form-control">
              <div className="flex items-center justify-between w-full py-3">
                <label>Ingredients</label>
                <button type="button" onClick={handleIngredientCount}>
                  <FaPlus className="text-2xl font-black text-white bg-blue-500 rounded-full w-7 h-7 flex items-center justify-center p-2" />
                </button>
              </div>
              <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2">
                {form.ingredients.map((ingredient, i) => (
                  <input
                    type="text"
                    key={i}
                    value={ingredient}
                    onChange={(e) => handleIngredient(e, i)}
                  />
                ))}
              </div>
            </div>

            <div className="form-control">
              <div className="flex items-center justify-between w-full py-3">
                <label>Procedures</label>
                <button type="button" onClick={handleStepCount}>
                  <FaPlus className="text-2xl font-black text-white bg-blue-500 rounded-full w-7 h-7 flex items-center justify-center p-2" />
                </button>
              </div>
              <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2">
                {form.steps.map((step, i) => (
                  <input
                    type="text"
                    key={i}
                    value={step}
                    onChange={(e) => handleStep(e, i)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="w-full mt-3 py-3 rounded border-2 border-white hover:border-slate-900 transition bg-slate-800 hover:bg-slate-900 text-white">
              Add Recipe
            </button>
          </form>

          {/* 
          To Test Forms
          {JSON.stringify(form)} 
          */}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default App;
