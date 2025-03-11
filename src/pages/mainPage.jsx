"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { Button } from "@/components/ui/button";
import TaskForm from "./taskForm";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";

export default function MainPage() {
  const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
  
  const [taskData, setTaskData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  const getTaskData=async()=>{
    try{
      const response = await axios.get(`${API_BASE_URL}/tasks/get-tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: localStorage.getItem("userId") || "",
        },
      });
      console.log("Task Data:", response.data);
      if (response.data) {
        setTaskData(response.data.tasks);
      }
    }
    catch(err){
        console.error("Error:", err);
    }
  }

  const signOut = async() => {
    try{
      const res = await fetch(`${API_BASE_URL}/auth/signout/`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: localStorage.getItem("userId") || "",
          'Content-Type': 'application/json'
        })
      });
      
      if (res){
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
      }
    }
    catch(err){
        console.error("Error:", err);
    }
  }

  const addTask = async(task) => {
    try{
      const res = await fetch(`${API_BASE_URL}/tasks/add-task`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: localStorage.getItem("userId") || "",
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(task)
      });
      
      if (res){
        setTaskData([...taskData, task]);
      }
    }
    catch(err){
        console.error("Error:", err);
    }
  }

  const editTask = async (task) => {
    try {
      console.log(task)
      const res = await axios.put(`${API_BASE_URL}/tasks/update-task`, task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: task._id,
        },
      }
      )

      if (res) {
        console.log("Task Updated:");
        setTaskData(
          taskData.map((item) =>
            item._id === task._id ? { ...item, ...task } : item
          )
        )
      }
    } catch (err) {
        console.error("Error:", err);
    }
  };

  const deleteTask=async()=> {
    try{
      const res = await axios.delete(`${API_BASE_URL}/tasks/delete-task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: selectedTask?._id,
        },
      });
      if (res){
        setTaskData(taskData.filter((item) => item._id !== selectedTask?._id));
        setOpenDelete(false);
      }
    }
    catch(err){
        console.error("Error:", err);
    }
  }

  useEffect(() => {
    getTaskData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task) => {
    if (selectedTask) {
      editTask(task);
    } else {
      addTask(task);
    }
  };

  return (
    <div className="flex bg-[#1f1d1d] justify-center">
      <div className=" w-screen flex flex-col items-center mt-4">
        <h2 className="text-white text-4xl">Task Managment App</h2>

        <div className="mt-10">
          <div className="flex justify-between my-4">
            <div className="flex space-x-4 justify-between items-center w-full">
              <Button
                className="!bg-cyan-800 rounded-lg text-white"
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            </div>
          </div>

          {taskData && taskData.length != 0 ? (
            <Table className="w-fit mt-10 text-white border-[1px] border-cyan-900 rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white bg-cyan-900">
                    Task ID
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    Title
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    Priority
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    Status
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    Start Time
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    End Time
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    Total Time to Finish (hrs)
                  </TableHead>
                  <TableHead className="text-white bg-cyan-900">Edit</TableHead>
                  <TableHead className="text-white bg-cyan-900">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {taskData &&
                  taskData?.map((task, itemId) => (
                    <TableRow key={itemId}>
                      <TableCell>{itemId + 1}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>
                        {new Date(task.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(task.endTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="flex justify-center">
                        {(
                          (new Date(task.endTime).getTime() -
                            new Date(task.startTime).getTime()) /
                          (1000 * 60 * 60)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-white bg-cyan-900 p-2 rounded-lg"
                          onClick={() => handleEditTask(task)}
                        >
                          Edit
                        </button>
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-white bg-red-900 p-2 rounded-lg"
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <h1 className="text-white">No Tasks to show</h1>
          )}
        </div>
      </div>

      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        selectedTask={selectedTask}
      />

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        {/* <DialogTrigger /> */}
        <DialogContent>
          <DialogTitle className="text-xl font-semibold">
            Are you sure?
          </DialogTitle>
          <p className="text-gray-600">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        className="border-[1px] border-red-600 rounded-lg text-red-600 font-semibold m-4"
        onClick={signOut}
      >
        Sign out
      </Button>
    </div>
  );
}