import Header from "./components/Header";
import {BrowserRouter as Router,Route} from 'react-router-dom'
import  Tasks  from "./components/Tasks";
import { useState,useEffect } from 'react';
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
  const [tasks,setTasks]=useState([])

const [showAddTask,setShowAddTask]= useState(false)

useEffect(()=>{
  const getTasks=async() =>{
    const tasksFromServer=await fetchTasks()
    setTasks(tasksFromServer)

  }
  
  getTasks()


},[])

const fetchTasks =async() =>{
  const res =await fetch('http://localhost:5000/tasks')
  const data =await res.json()
  console.log(data)
  return data
}

const addTask =async(task) =>{
  const res =await fetch('http://localhost:5000/tasks',{
    method:'POST',
    headers:{
      'Content-type':'application/json',
    },
    body:JSON.stringify(task)
  })
  const data= await res.json()
  setTasks([...tasks,data])
  
  
  
}

const deleteTask = async(id) =>{
  await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'DELETE'
  })

  setTasks(tasks.filter((task) => task.id !==id
  ))
}

const toggleReminder =async(id) =>{
  const taskToToggle=await fetchTasks(id)
  const upTask={...taskToToggle,
  reminder: !taskToToggle.reminder}

  const res=await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'PUT',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify(upTask)
  })
  const data = await res.json()

  setTasks(
    tasks.map((task) =>
    task.id ===id? {...task,reminder:!data.reminder }:task

    )
  )

}


  return (
    <Router>
    <div className="container">
      <Header 
      onAdd={() => setShowAddTask(!showAddTask)} 
      showAdd={showAddTask}
      />
      
      <Route path='/' exact render={(props)=>(
        <div>
          {showAddTask && <AddTask onAdd={addTask}/>}
            {tasks.length> 0 ?(
              <Tasks 
              tasks={tasks} 
              onDelete={deleteTask}
              onToggle={toggleReminder}
        />
      ) : (
        'No Tasks To Show'

      )
        
      }
        </div>
      )}/>
      <Route path='/about' component={About}/>
      <Footer/>
      
      
    </div>
    </Router>
  );
}

export default App;
