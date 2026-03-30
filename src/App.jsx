import React, { useEffect, useState } from "react";
import Header from "./Header";
import UIBox from "./UIBox";
import Form from "./Form";
import UIMsg from "./UIMsg";

const App = () => {
  const [rejectCount, setRejectCount] = useState(1);
  const [task, setTask] = useState(() => {
   try{ const localSavedTasks = localStorage.getItem("task");
      return localSavedTasks ? JSON.parse(localSavedTasks) : [];
    }
    catch {
      return [];
    }
  });
   const [filter, setFilter] = useState("all");
  const [data, setData] = useState("");
  const [state, setState] = useState({
    phase: "idle",
    status: null,
    action: null,
    targetId: null,
  });
  useEffect(() => {
    localStorage.setItem("task", JSON.stringify(task));
  }, [task]);
  useEffect(() => {
    async function fetcher() {
      try{updateState({ phase: "loading", action: "fetching" });
      await server(); 
        updateState({ phase: "idle", action: null });
      } catch {
        updateState({ status: "fetchFailed", action:"fetching" });
      }
    }
    fetcher();
  },[]);
   
  
  function server() {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (rejectCount % 6 == 0) {
          rej();
        } else {
          res();
        }
        setRejectCount(pr => pr + 1);
        
      }, 800);
    })
  }
  function wait() {
    return new Promise(res => setTimeout(res, 200));
  }
   function updateState(newSt) {
    setState(pr => ({ ...pr, ...newSt })); 
  }
 async function taskAdder(e) {
   e.preventDefault();
   if (state.phase === "loading" ) {
     updateState({ status: "parallelProcess" });
     return false;
   }
   if (data.length < 1) {
     updateState({ phase: "idle", status: "emptyInput", action: "editButton" });
     return false;
   }

   try {
     if (state.targetId) {
       updateState({
         phase: "loading",
         action: "taskButton",
         status: "taskEditing",
       });
       const editedList = task.map((t) =>
         t.id === state.targetId ? { ...t, title: data } : t,
       );
       await server();
       setTask(editedList);
       updateState({
         phase: "idle",
         status: "edited",
         action: null,
         targetId: null,
       });
        setData("");
     } else {
       updateState({
         phase: "loading",
         action: "taskButton",
         status: "taskAdding",
       });
       await wait();
       await server();
       const newTask = {
         id: Date.now(),
         title: data,
         status: "pending",
       };
       setTask((pr) => [...pr, newTask]);
       updateState({ phase: "idle", status: "uploaded", action: null });
       setData("");
     }
   } catch {
     updateState({ phase: "error", status: "uploadFailed", action: null });
   } finally {
     
   }
 }
  function dataSetter(e) {
    const data = e.target.value;
    setData(data); 
  }
  async function taskDeleter(id) {
    if (state.phase === "loading" || state.targetId) {
      updateState({status:"parallelProcess"})
      return false
    };
    updateState({ phase: "loading", status: "deleting", action: "delete", targetId:id });
    const taskListNew = task.filter(t => t.id !== id);
    // i want to know, where is old task list gone, means every previous state, which is removed, how it is deleted from data.system level question.
    try {
      await server()
      updateState({ phase: "success", status: "deleted", action: null, targetId:null });
      await wait();
      setTask(taskListNew);
    } catch {
      updateState({ phase: "error", status: "deleteFailed", action: null });
    } finally {
      await wait();
      updateState({ phase: "idle", action: null, targetId: null });
      setData("");
      
    }
  };
  function editorData(id) {
    if (state.phase === "loading") return false;
    updateState({ phase: "idle", status: "editProgress", action:"editButton",targetId: id });
    const taskToEdit = task.find(t => t.id === id);
    if (!taskToEdit) return;
    setData(taskToEdit.title);
    
  }
  async function completer(id) {
    if (state.phase === "loading" || state.targetId) {
      updateState({ status: "parallelProcess" });
      return false;
    }
    updateState({
      phase: "loading",
      status: "marking",
      action: "marker",
      targetId: id,
    });
    await wait();
    try {
      const completedList = task.map((t) => {
        if (t.id === id) {
          return t.status === "pending"
            ? { ...t, status: "completed" }
            : { ...t, status: "pending" };
        } else {
          return t;
        }
      });
      await server();
      setTask(completedList);
      updateState({ status: "marked" });
    } catch {
      updateState({ status: "markError" });
    } finally {
      await wait();
      updateState({ phase: "idle", action: null, targetId: null });
      setData("");
    }
  }
  function taskFilterer(e) {
    if (state.phase === "loading") return false;
    setFilter(e);
 }
 
  return (
    <>
      <Header />
      <Form
        targetId={state.targetId}
        data={data}
        taskAdder={taskAdder}
        disable={state.phase}
        dataSetter={dataSetter}
        action={state.action}
      />
      <UIMsg status={state.status} />
      {state.phase === "loading" && state.action === "fetching" ? (
        <p>Loading tasks...</p>
      ) : (
          <UIBox
            task={task}
          action={state.action}
          completer={completer}
          editorData={editorData}
          taskDeleter={taskDeleter}
          targetId={state.targetId}
            phase={state.phase}
            filter={filter}
            taskFilterer={taskFilterer}
        />
      )}

     
    </>
  );
};
export default App;
