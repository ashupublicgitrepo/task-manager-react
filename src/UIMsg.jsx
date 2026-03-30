import React from "react";

const UIMsg = ({ status }) => {
  const statusMap = {
    emptyInput: "please enter valid input.",
    taskAdding: "please wait, task is adding in list.",
    uploaded: "task added successfully.",
    deleted: "task has been deleted from list successfully.",
    taskEditing: "...task is editing, please wait",
    edited: "task edited successfully.",
    editProgress: "please enter data to edit this task.",
    deleting: "task has been ...deleting.",
    parallelProcess: "other task is running, please complete it first",
    marking: "...marking, please wait.",
    marked: "task marked as instructed.",
    markError:
      "! ...internal server error, task marking failed, please try again.",
    uploadFailed: "! ...internal server error, upload task failed, please try again.",
    deleteFailed: "! ...internal server error, can't delete, please try again.",
    fetchFailed: "cant get info, please reloade again to load from server.",
  };
  function statusMapper() {
    return statusMap[status];
  }
  return <p style={{margin:"10px"}}>{statusMapper()}</p>;
};

export default UIMsg;
