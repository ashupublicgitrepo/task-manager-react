import React from "react";
const Form = ({ taskAdder, data, dataSetter, disable, targetId, action }) => {
  function taskButton() {
    if (disable == "loading" && action == "taskButton") return "...loading";
    else if (targetId) return "update Task";
    else return "add Task";
   }
    return (
      <>
        <form action="" onSubmit={(e) => taskAdder(e)}>
          <input type="text" value={data} onChange={dataSetter} />
          <button disabled={disable == "loading" && action == "taskButton"}>
            {taskButton()}
          </button>
        </form>
      </>
    );
}
export default Form;