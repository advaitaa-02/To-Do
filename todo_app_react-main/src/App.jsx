import { useEffect, useState } from "react";
import axios from 'axios'
import Search from "./components/Search";
import TodoList from "./components/TodoList";
import Filter from "./components/Filter";

function App() {
  // const [todos, setTodos] = useState([
  //   { id: 0, task: "Learn JavaScript", status: "Active" },
  //   { id: 1, task: "Read a self-help book", status: "Active" },
  //   { id: 2, task: "Play PS5", status: "Active" },
  //   { id: 3, task: "Watch YouTube videos", status: "Active" },
  //   // { id: 5, task: "Pray to God", status: "Active" },
  // ]);

  const [todos, setTodos] = useState([])
  const [errors,setErrors]=useState("")

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/todos")
    .then(res=>{
      // console.log(res.data)
      setTodos(res.data)
    },[])

    .catch(err=>{
      setErrors[err.message]
    })


  })


// add todo function
  const addTodo = (data) => {

    const originalTodos = [...todos]
    setTodos( [ ...todos, data={...data, id:parseInt(todos[todos.length-1].id) + 1, status:"Active"}] )
    // console.log(data)
    axios.post("http://127.0.0.1:8000/todos",data)
    .then(res=>setTodos([...todos,res.data]))
    .catch(err =>{
      setErrors(err.message)
      setTodos(originalTodos)
    })
  }

  // delete function
  const delTodo = (id) => {
    setTodos(todos.filter( todo => todo.id != id ))
    const originalTodos = [...todos]
    axios.delete("http://127.0.0.1:8000/todos/"+id)
    .catch(err=>{
      setErrors[err.message]
      setTodos(originalTodos)
    })
  }


  // update function
  const updateTodo = (e, id, text, todo) => {
    e.preventDefault()
    // this line helps to get the current todo based on the ID called todoId in TodoList
    // const todo = todos[id]
    const updatedUser = { ...todo, task:text, status:"Active" }
    setTodos(todos.map(t => t.id == todo.id ? updatedUser : t))


    const updatedTodo = {...todo,task:text}
    axios.patch("http://127.0.0.1:8000/todos/"+ id , updatedTodo)

  }

  const completeTodo = (e, id,todo) => {

    if(e.target.checked){
      console.log("okay")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, completed:true}: todo))
      const updatedTodo = {...todo,completed:true}
      axios.patch("http://127.0.0.1:8000/todos/"+ id , updatedTodo)
    }
    else
    {
      console.log("omo")
      const updatedTodo = {...todo,completed:false}
      axios.patch("http://127.0.0.1:8000/todos/"+ id , updatedTodo)
      setTodos(todos.map(todo => todo.id == id ? { ...todo, completed:false}: todo))
    }

   
  }

  const filterTodo = (cat_value) => {
    // setTodos(todos.filter(todo => todo.status == cat_value))
    setTodos(todos.filter((todo) => todo.status == cat_value))
  }


  return (
    <div className="todo-container">

    {errors && <p>{errors}</p>}
      <Search addTodo = { addTodo } />
      <Filter filter_todo = { filterTodo }/>
      <TodoList todos = { todos } delTodo = { delTodo } update_todo = { updateTodo } complete_todo = { completeTodo } filter_todo = { filterTodo } />
    </div>
  );
}



export default App;
