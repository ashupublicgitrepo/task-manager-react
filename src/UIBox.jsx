import React from "react";
import Form from "./Form";
const UIBox = ({
  taskDeleter,
  targetId,
  phase,
  editorData,
  completer,
  action, 
  taskFilterer,
  task, 
  filter
}) => {
  
  let filteredTask = task.filter(t => {
   if (filter === "completed") return t.status === "completed";
    if (filter === "pending") return t.status === "pending";
    return true;
  });
  function filterChecker() {
    
      if (filter === "completed") return "no completed task found.";
      if (filter === "pending") return "no pending task found.";
      else return "no task found."
    
  }
// and thats what i was thinking, if anything which is derived, should be handled in its own component, like we handeling ui msg, and it is derived in its component. derived state must be handeled on specific component. 
  
  return (
    <>
      <label htmlFor="filter">
        filter
        <select value={filter} name="" id="filter" onChange={(e)=>taskFilterer(e.target.value)}>
          <option value="all">all</option>
          <option value="completed">completed</option>
          <option value="pending">pending</option>
        </select>
      </label>
      {filteredTask.length < 1 ? <p>{filterChecker()}</p>: (
        <table border={"1px"}>
          <thead>
            <tr>
              <th>sr.no.</th>
              <th>title</th>
              <th>status</th>
              <th>edit</th>
              <th>check</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {(
              filteredTask.map((e, i) => {
                return (
                  <tr key={e.id}>
                    <td>{i + 1}</td>
                    <td>{e.title}</td>
                    <td>{e.status}</td>
                    <td>
                      <button
                        disabled={
                          e.status === "completed" ||
                          (e.id == targetId && action === "editButton")
                        }
                        onClick={() => editorData(e.id)}
                      >
                        edit
                      </button>
                    </td>
                    <td>
                      <button
                        disabled={phase === "loading" && e.id === targetId}
                        onClick={() => completer(e.id)}
                      >
                        {phase === "loading" &&
                          targetId === e.id &&
                          action === "marker"
                          ? "...marking"
                          : e.status === "completed"
                            ? "mark as pending"
                            : "mark as complete"}
                      </button>
                    </td>
                    <td>
                      <button
                        disabled={
                          phase === "loading" &&
                          targetId == e.id &&
                          action == "delete"
                        }
                        onClick={() => taskDeleter(e.id)}
                      >
                        {phase === "loading" &&
                          targetId == e.id &&
                          action === "delete"
                          ? "...Deleting"
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              }))}
          </tbody>
        </table>)}
    </>
  );
};
export default UIBox;
