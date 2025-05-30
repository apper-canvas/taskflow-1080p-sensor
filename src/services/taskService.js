// Task service for managing task operations with Apper backend

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

// Table and field definitions for tasks
const TASK_TABLE = 'task'
const TASK_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'completed', 'priority', 'due_date', 'category_id', 'created_at'
]

// Updateable fields only (for create/update operations)
const UPDATEABLE_TASK_FIELDS = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'completed', 'priority', 'due_date', 'category_id', 'created_at'
]

export const taskService = {
  // Fetch all tasks with optional filtering
  async fetchTasks(filter = 'all') {
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: TASK_FIELDS,
        orderBy: [
          {
            fieldName: "created_at",
            SortType: "DESC"
          }
        ]
      }

      // Add filtering based on filter type
      if (filter === 'completed') {
        params.where = [
          {
            fieldName: "completed",
            operator: "ExactMatch",
            values: [true]
          }
        ]
      } else if (filter === 'active') {
        params.where = [
          {
            fieldName: "completed",
            operator: "ExactMatch",
            values: [false]
          }
        ]
      }

      const response = await apperClient.fetchRecords(TASK_TABLE, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }

      // Transform data to match UI format
      return response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title || task.Name || '',
        description: task.description || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date ? new Date(task.due_date) : new Date(),
        categoryId: task.category_id || 'personal',
        createdAt: task.created_at ? new Date(task.created_at) : new Date()
      }))
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }
  },

  // Get a single task by ID
  async getTaskById(taskId) {
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: TASK_FIELDS
      }

      const response = await apperClient.getRecordById(TASK_TABLE, taskId, params)
      
      if (!response || !response.data) {
        return null
      }

      const task = response.data
      return {
        id: task.Id.toString(),
        title: task.title || task.Name || '',
        description: task.description || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date ? new Date(task.due_date) : new Date(),
        categoryId: task.category_id || 'personal',
        createdAt: task.created_at ? new Date(task.created_at) : new Date()
      }
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error)
      throw error
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      const apperClient = getApperClient()
      
      const params = {
        records: [
          {
            Name: taskData.title,
            title: taskData.title,
            description: taskData.description || '',
            completed: false,
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate instanceof Date ? taskData.dueDate.toISOString().split('T')[0] : taskData.dueDate,
            category_id: taskData.categoryId || 'personal',
            created_at: new Date().toISOString()
          }
        ]
      }

      const response = await apperClient.createRecord(TASK_TABLE, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response.results?.[0]?.message || "Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  },

  // Update an existing task
  async updateTask(taskId, taskData) {
    try {
      const apperClient = getApperClient()
      
      const params = {
        records: [
          {
            Id: parseInt(taskId),
            Name: taskData.title,
            title: taskData.title,
            description: taskData.description || '',
            completed: taskData.completed,
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate instanceof Date ? taskData.dueDate.toISOString().split('T')[0] : taskData.dueDate,
            category_id: taskData.categoryId || 'personal'
          }
        ]
      }

      const response = await apperClient.updateRecord(TASK_TABLE, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response.results?.[0]?.message || "Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      const apperClient = getApperClient()
      
      const params = {
        RecordIds: [parseInt(taskId)]
      }

      const response = await apperClient.deleteRecord(TASK_TABLE, params)
      
      if (response && response.success) {
        return true
      } else {
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }
}