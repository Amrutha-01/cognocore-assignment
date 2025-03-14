import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TaskForm({
  isOpen,
  onClose,
  onSave,
  selectedTask,
}) {
  const [taskData, setTaskData] = useState({
    _id: "",
    title: "",
    status: "pending",
    priority: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (selectedTask) {
      setTaskData(selectedTask);
    } else {
      setTaskData({
        _id: "",
        title: "",
        status: "pending",
        priority: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (
      !taskData.title ||
      !taskData.status ||
      !taskData.priority ||
      !taskData.startTime ||
      !taskData.endTime
    ) {
      alert("All fields are required!");
      return;
    }
    onSave(taskData);
    onClose();
  };

  const handleStatusChange = (checked) => {
    setTaskData({ ...taskData, status: checked ? "completed" : "pending" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 !bg-white">
        <DialogHeader>
          <DialogTitle>{selectedTask ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
          />
          <div className="flex items-center gap-x-8">
            <div className="flex items-center gap-2">
              <Label className="text-gray-700">Status:</Label>
              <span
                className={
                  taskData.status == "completed"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {taskData.status.charAt(0).toUpperCase() +
                  taskData.status.slice(1)}
              </span>
              <Switch
                checked={taskData.status === "completed"}
                onCheckedChange={handleStatusChange}
                className="!p-0 !border-none !bg-gray-300"
              />
            </div>
            <Input
              type="number"
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              placeholder="Priority"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <Label>Start Time:</Label>
              <Input
                name="startTime"
                type="datetime-local"
                value={
                  taskData.startTime
                    ? new Date(taskData.startTime).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700">End Time:</Label>
              <Input
                name="endTime"
                type="datetime-local"
                value={
                  taskData.endTime
                    ? new Date(taskData.endTime).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="!text-white !bg-red-700 border-red-500">
              Cancel
            </Button>
            <Button onClick={handleSave} className="!bg-cyan-800">
              {selectedTask ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
