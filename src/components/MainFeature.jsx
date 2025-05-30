import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: 'work', name: 'Work', icon: 'Briefcase' },
    { id: 'personal', name: 'Personal', icon: 'User' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart' }
  ])
  
  // Loading states
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  
  // Error states
  const [errorTasks, setErrorTasks] = useState(false)
  const [errorCategories, setErrorCategories] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    categoryId: 'personal'
  })

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-700 border-green-200' }
  ]

  const categories = [
    { id: 'work', name: 'Work', icon: 'Briefcase' },
    { id: 'personal', name: 'Personal', icon: 'User' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart' }
  ]

  const filters = [
    { id: 'all', name: 'All Tasks', icon: 'List' },
    { id: 'active', name: 'Active', icon: 'Circle' },
    { id: 'completed', name: 'Completed', icon: 'CheckCircle' },
    { id: 'overdue', name: 'Overdue', icon: 'AlertCircle' }
  ]

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed
      case 'completed':
        return task.completed
      case 'overdue':
        return !task.completed && isPast(task.dueDate) && !isToday(task.dueDate)
      default:
        return true
    }
  })

  // Load tasks and categories on component mount
  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [])

  const loadTasks = async (filterType = 'all') => {
    setLoadingTasks(true)
    setErrorTasks(false)
    try {
      const fetchedTasks = await taskService.fetchTasks(filterType)
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Failed to load tasks:", error)
      setErrorTasks(true)
      toast.error("Failed to load tasks. Please try again.")
    } finally {
      setLoadingTasks(false)
    }
  }

  const loadCategories = async () => {
    setLoadingCategories(true)
    setErrorCategories(false)
    try {
      const fetchedCategories = await categoryService.fetchCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Failed to load categories:", error)
      setErrorCategories(true)
      // Keep default categories on error
    } finally {
      setLoadingCategories(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed
      case 'completed':
        return task.completed
      case 'overdue':
        return !task.completed && isPast(task.dueDate) && !isToday(task.dueDate)
      default:
        return true
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    handleTaskSubmit()
  }

  const handleTaskSubmit = async () => {
    setLoadingSubmit(true)
    try {
      if (editingTask) {
        // Update existing task
        await taskService.updateTask(editingTask.id, {
          ...formData,
          dueDate: new Date(formData.dueDate),
          completed: editingTask.completed
        })
        toast.success('Task updated successfully!')
        setEditingTask(null)
      } else {
        // Create new task
        await taskService.createTask({
          ...formData,
          dueDate: new Date(formData.dueDate)
        })
        toast.success('Task created successfully!')
      }

      // Reset form and reload tasks
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        categoryId: 'personal'
      })
      setShowForm(false)
      await loadTasks(filter)
    } catch (error) {
      console.error("Failed to save task:", error)
      toast.error(editingTask ? "Failed to update task" : "Failed to create task")
    } finally {
      setLoadingSubmit(false)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      await taskService.updateTask(id, {
        ...task,
        completed: !task.completed
      })
      
      if (!task.completed) {
        toast.success('Task completed! 🎉')
      } else {
        toast.success('Task marked as pending')
      }
      
      await loadTasks(filter)
    } catch (error) {
      console.error("Failed to toggle task:", error)
      toast.error("Failed to update task status")
    }
  }

  const deleteTask = async (id) => {
    setLoadingDelete(true)
    try {
      await taskService.deleteTask(id)
      toast.success('Task deleted successfully')
      await loadTasks(filter)
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast.error("Failed to delete task")
    } finally {
      setLoadingDelete(false)
    }
  }

  const editTask = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: format(task.dueDate, 'yyyy-MM-dd'),
      categoryId: task.categoryId
    })
    setShowForm(true)
  }

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Overdue'
    return format(date, 'MMM dd')
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'priority-medium'
    }
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || 'Circle'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
  // Reload tasks when filter changes
  useEffect(() => {
    loadTasks(filter)
  }, [filter])

        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">My Tasks</h1>
          <p className="text-surface-600 mt-1">
            {filteredTasks.filter(t => !t.completed).length} pending, {filteredTasks.filter(t => t.completed).length} completed
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
    const category = categories?.find(c => c.id === categoryId)
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Task</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {filters.map((filterOption) => (
          <motion.button
            key={filterOption.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filterOption.id)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === filterOption.id
                ? 'bg-primary text-white shadow-glow'
                : 'bg-white text-surface-600 border border-surface-300 hover:bg-surface-50'
            }`}
          >
            <ApperIcon name={filterOption.icon} className="w-4 h-4" />
            <span className="text-sm">{filterOption.name}</span>
          </motion.button>
          disabled={loadingTasks || loadingSubmit}
        ))}
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowForm(false)
              setEditingTask(null)
        {loadingTasks && (
          <div className="text-sm text-surface-500 flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading tasks...</span>
          </div>
        )}
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: format(new Date(), 'yyyy-MM-dd'),
                categoryId: 'personal'
              })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            disabled={loadingTasks}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-surface-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowForm(false)
                    setEditingTask(null)
                  }}
                  className="p-2 rounded-lg hover:bg-surface-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title..."
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add description..."
                    rows="3"
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="input-field"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="input-field"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingTask(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
                  disabled={loadingSubmit}
        <AnimatePresence>
                  {loadingSubmit && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckSquare" className="w-8 h-8 text-surface-400" />
              </div>
                  disabled={loadingSubmit}
              <h3 className="text-lg font-semibold text-surface-900 mb-2">No tasks found</h3>
              <p className="text-surface-600">
                {filter === 'all' 
                  ? "Create your first task to get started!" 
                  : `No ${filter} tasks at the moment.`
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`task-card ${task.completed ? 'task-card-completed' : ''} group`}
              >
                <div className="flex items-start space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
          {errorTasks ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load tasks</h3>
              <p className="text-surface-600 mb-4">There was an error loading your tasks.</p>
              <button
                onClick={() => loadTasks(filter)}
                className="btn-primary"
                disabled={loadingTasks}
              >
                {loadingTasks ? 'Retrying...' : 'Try Again'}
              </button>
            </motion.div>
          ) : filteredTasks.length === 0 && !loadingTasks ? (
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed 
                        ? 'bg-secondary border-secondary' 
                        : 'border-surface-300 hover:border-primary'
                    }`}
                  >
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-surface-900 mb-1 ${
                          task.completed ? 'line-through text-surface-500' : ''
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mb-3 ${
                            task.completed ? 'text-surface-400' : 'text-surface-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`category-chip ${getPriorityClass(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          
                          <span className="flex items-center space-x-1 text-surface-500">
                    disabled={loadingTasks}
                            <ApperIcon name={getCategoryIcon(task.categoryId)} className="w-3 h-3" />
                            <span>{categories.find(c => c.id === task.categoryId)?.name}</span>
                          </span>
                          
                          <span className={`flex items-center space-x-1 ${
                            isPast(task.dueDate) && !task.completed && !isToday(task.dueDate)
                              ? 'text-red-600' 
                              : 'text-surface-500'
                          }`}>
                            <ApperIcon name="Calendar" className="w-3 h-3" />
                            <span>{getDateLabel(task.dueDate)}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => editTask(task)}
                          className="p-2 rounded-lg hover:bg-surface-100"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4 text-surface-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTask(task.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                            <span>{categories?.find(c => c.id === task.categoryId)?.name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MainFeature
                          disabled={loadingTasks || loadingSubmit}
                          disabled={loadingTasks || loadingDelete}
                          {loadingDelete ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                          )}