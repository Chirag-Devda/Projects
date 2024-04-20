import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./components/Navbar";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

function App() {
  const [todo, settodo] = useState("");
  const [Todos, setTodos] = useState([]);
  const [showfinished, setshowfinished] = useState(false);
  const [completed, setcompleted] = useState([]);
  const [uncompleted, setuncompleted] = useState([]);
  const [BothArray, setBothArray] = useState([
    {
      showfinishedArrayState: "completed",
      unfinishedArrayState: "uncompleted",
    },
  ]);
  useEffect(() => {
    const completedFetched = JSON.parse(localStorage.getItem("completed"));
    if (completedFetched) {
      setcompleted(completedFetched);
    }

    const uncompletedFetched = JSON.parse(localStorage.getItem("uncompleted"));
    if (uncompletedFetched) {
      setuncompleted(uncompletedFetched);
    }

    const TodosFetched = JSON.parse(localStorage.getItem("Todos"));
    if (TodosFetched.length) {
      setTodos(TodosFetched);
    }
  }, []);

  // Save data to local storage
  const savetoLS = () => {
    localStorage.setItem("uncompleted", JSON.stringify(uncompleted));
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("Todos", JSON.stringify(Todos));
  };

  // running function and saving data instantly
  useEffect(() => {
    handlcompleted();
    handluncompleted();
  }, [Todos]);
  useEffect(() => {
    savetoLS();
  }, [completed]);

  // Function to get the array based on the showfinished state and BothArray state
  const getArrayToShow = () => {
    if (showfinished) {
      return BothArray[0].showfinishedArrayState === "completed"
        ? completed
        : uncompleted;
    } else {
      return BothArray[0].unfinishedArrayState === "Todos"
        ? uncompleted
        : Todos;
    }
  };

  const handlcompleted = () => {
    const t = true;
    let iscompletedTrue = Todos.filter((item) => {
      return item.iscompleted === t;
    });
    setcompleted(iscompletedTrue);
  };
  const handluncompleted = () => {
    let isucompletedFalse = Todos.filter((item) => {
      return !item.iscompleted;
    });
    setuncompleted(isucompletedFalse);
  };

  const handleAdd = () => {
    setTodos([...Todos, { id: uuidv4(), todo, iscompleted: false }]);
    settodo("");
    savetoLS();
  };

  const handleEdit = (e, id) => {
    let t = Todos.filter((item) => {
      return item.id == id;
    });
    settodo(t[0].todo);
    let newtodos = Todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newtodos);
  };

  document.onkeydown = function EnterToAddTodo(e) {
    if (e.keyCode == 13) {
      handleAdd();
    }
  };

  const handleDelete = (e, id) => {
    let newtodos = Todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newtodos);
    let newcompleted = completed.filter((item) => {
      return item.id !== id;
    });
    setcompleted(newcompleted);
  };

  const handlechange = (e) => {
    settodo(e.target.value);
  };

  const handlecheckbox = (e) => {
    let id = e.target.name;
    let index = Todos.findIndex((item) => {
      return item.id === id;
    });
    let newtodos = [...Todos];
    newtodos[index].iscompleted = !newtodos[index].iscompleted;
    setTodos(newtodos);
  };

  const togglefinished = () => {
    setshowfinished(!showfinished);
  };

  return (
    <>
      <Navbar />
      <div className="w-screen container bg-[#e9bdec] md:mx-auto my-9 rounded-lg p-3 min-h-screen max-h-full md:w-1/2">
        <h1 className="text-center text-black my-3 text-2xl font-bold">
          "Daily~Do: Har Din Ek Naya Kadam"
        </h1>
        <div className="Add-todo ">
          <h2 className=" font-bold text-lg">Add Todo</h2>
          <div className="input my-2 flex">
            <input
              onChange={handlechange}
              value={todo}
              type="text"
              className="py-2 px-1 rounded-lg w-full border-[3px] border-solid border-[#1c9e97]"
              placeholder="Write Your Tasts"
            />
            <button
              onClick={handleAdd}
              className="bg-[#1c9e97] py-2 px-4 rounded-lg mx-5"
              disabled={todo.length <= 3}
            >
              Save
            </button>
          </div>
        </div>
        {Todos.length > 0 && (
          <div className="ShowFinished my-5">
            <input
              onChange={togglefinished}
              type="checkbox"
              checked={showfinished}
              className="cursor-pointer"
            />
            <span>Show Finished</span>
          </div>
        )}
        <h2 className=" font-bold text-lg">Your Todos</h2>
        <div className="todos">
          {Todos.length == 0 && (
            <div className="m-5 font-medium text-lg">No Todos to display</div>
          )}
          {getArrayToShow().map((item) => {
            return (
              (showfinished || !item.iscompleted) && (
                <div
                  key={item.id}
                  className="todo flex justify-between my-3 md:w-full"
                >
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      name={item.id}
                      onChange={handlecheckbox}
                      checked={item.iscompleted}
                      className="cursor-pointer"
                    />

                    <div
                      className={
                        item.iscompleted ? "line-through text-blue-500" : ""
                      }
                    >
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex items-start">
                    <button
                      onClick={(e) => {
                        handleEdit(e, item.id);
                      }}
                      className="bg-[#1c9e97] py-2 px-4 items-start rounded-lg mx-2 text-xl"
                    >
                      <MdModeEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(e, item.id);
                      }}
                      className="bg-[#1c9e97] py-2 px-4 rounded-lg mx-2 text-xl"
                    >
                      <RiDeleteBin6Fill />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
