const mongoose = require("mongoose");
const Task = require("../models/Task");

const buildTaskQuery = (userId, queryParams) => {
  const query = { user: userId };

  if (queryParams.search) {
    query.title = { $regex: queryParams.search, $options: "i" };
  }

  if (queryParams.status) {
    query.status = queryParams.status;
  }

  if (queryParams.priority) {
    query.priority = queryParams.priority;
  }

  return query;
};

const buildSortOption = (sort) => {
  switch (sort) {
    case "dueDate_desc":
      return { dueDate: -1 };
    case "createdAt_asc":
      return { createdAt: 1 };
    case "createdAt_desc":
      return { createdAt: -1 };
    case "dueDate_asc":
    default:
      return { dueDate: 1 };
  }
};

const getTasks = async (req, res, next) => {
  try {
    const query = buildTaskQuery(req.user._id, req.query);
    const sort = buildSortOption(req.query.sort);

    const tasks = await Task.find(query).sort(sort);

    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

const getTaskSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const summary = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    summary.forEach((item) => {
      counts.total += item.count;

      if (item._id === "Pending") {
        counts.pending = item.count;
      }

      if (item._id === "In Progress") {
        counts.inProgress = item.count;
      }

      if (item._id === "Completed") {
        counts.completed = item.count;
      }
    });

    return res.status(200).json(counts);
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  getTaskSummary,
  createTask,
  updateTask,
  deleteTask,
};
