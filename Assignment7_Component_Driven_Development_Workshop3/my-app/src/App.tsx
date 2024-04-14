import { useEffect, useState } from "react";

import Header from "./Component/Header/header";
import List from "./Component/List/list";
import Footer from "./Component/Footer/footer";
import Todo from "./Types/type";

import "./App.css";
function App() {
  const [todos, setTodo] = useState<Todo[]>([]);
  // const [footer, setFooter] = useState(false);

  // Fetch the data from server
  useEffect(() => {
    async function getItems() {
      const response: Response = await fetch("http://localhost:7003/todos");
      const result: Todo[] = await response.json();
      setTodo(result);
    }
    getItems();
  }, []);

  const addNewItem = (newtoDo: Todo) => {
    setTodo([...todos, newtoDo]);
  };
  // Delete One Item:
  const deleteOne = (id: string) => {
    const data = todos.filter((items) => items.id !== id);
    setTodo(data);
  };

  const updatetodo = (id: string) => {
    // Find the todo which you checked, then change done to be not done (The opposit of done)
    const newTodo = todos.map((element) => {
      if (element.id === id) {
        return { ...element, done: !element.done }; //done == false
      } else {
        return element;
      }
    });
    setTodo(newTodo);
  };

  const allCheckedItems = () => {
    const allDone = todos.every((todo) => todo.done); //false: Indicating not all todos.done are true
    const newTodo = todos.map((todo) => ({ ...todo, done: !allDone }));
    // setFooter(!allDone); //set done:true
    setTodo(newTodo); //set done:true
  };

  // Delete All Checked items
  const deleteFinishedTask = () => {
    const uncheckItem = todos.filter((items) => !items.done); //return items that are not check
    setTodo(uncheckItem);
    // setFooter(false);
  };

  return (
    <div className="todo-container">
      <div className="todo-wrap">
        <Header onAddItem={addNewItem} />
        <List items={todos} oneUpdateTodo={updatetodo} deleteItem={deleteOne} />
        <Footer
          items={todos}
          updateFooterTodo={allCheckedItems}
          dlelteAllItems={deleteFinishedTask}
        />
      </div>
    </div>
  );
}

export default App;