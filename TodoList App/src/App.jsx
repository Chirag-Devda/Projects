import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./components/Navbar";

function App() {
  const [todo, settodo] = useState("");
  const [Todos, setTodos] = useState([]);
  const handleAdd = () => {
    setTodos([...Todos, { id: uuidv4(), todo, iscompleted: false }]);
    settodo("");
    console.log(Todos);
  };
  const handleEdit = () => {};
  const handleDelete = () => {};
  const handlechange = (e) => {
    settodo(e.target.value);
  };
  const handlecheckbox = (e) => {
    let id = e.target.name;
    let index = Todos.findIndex((item) => {
      return (item.id = id);
    });
    let newtodos = [...Todos];
    newtodos[index].iscompleted = !newtodos[index].iscompleted;
    setTodos(newtodos);
  };

  return (
    <>
      <Navbar />
      <div className="container bg-[#e9bdec] mx-auto my-9 rounded-lg p-3 min-h-screen max-h-full ">
        <div className="Add-todo ">
          <h2 className=" font-bold text-lg">Add Todos</h2>
          <div className="input my-2">
            <input
              onChange={handlechange}
              value={todo}
              type="text"
              className="py-2 px-1 rounded-lg w-80"
              placeholder="Write Your Tasts"
            />
            <button
              onClick={handleAdd}
              className="bg-[#1c9e97] py-2 px-4 rounded-lg mx-5"
            >
              Add
            </button>
          </div>
        </div>
        <h2 className=" font-bold text-lg">Add Todos</h2>
        <div className="todos ">
          {Todos.map((item) => {
            return (
              <div
                key={item.id}
                className="todo flex items-center w-1/3 justify-between my-4 "
              >
                <input
                  type="checkbox"
                  name={item.id}
                  onChange={handlecheckbox}
                />

                <div className={item.iscompleted ? "line-through" : ""}>
                  {item.todo}
                </div>
                <div className="buttons">
                  <button
                    onClick={handleEdit}
                    className="bg-[#1c9e97] py-2 px-4 rounded-lg mx-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-[#1c9e97] py-2 px-4 rounded-lg mx-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
