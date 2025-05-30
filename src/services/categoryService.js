// Category service for managing category operations with Apper backend

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

// Table and field definitions for categories
const CATEGORY_TABLE = 'category'
const CATEGORY_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'icon'
]

export const categoryService = {
  // Fetch all categories
  async fetchCategories() {
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: CATEGORY_FIELDS,
        orderBy: [
          {
            fieldName: "Name",
            SortType: "ASC"
          }
        ]
      }

      const response = await apperClient.fetchRecords(CATEGORY_TABLE, params)
      
      if (!response || !response.data || response.data.length === 0) {
        // Return default categories if no categories exist
        return [
          { id: 'work', name: 'Work', icon: 'Briefcase' },
          { id: 'personal', name: 'Personal', icon: 'User' },
          { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart' }
        ]
      }

      // Transform data to match UI format
      return response.data.map(category => ({
        id: category.Id.toString(),
        name: category.Name || '',
        icon: category.icon || 'Folder'
      }))
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Return default categories on error
      return [
        { id: 'work', name: 'Work', icon: 'Briefcase' },
        { id: 'personal', name: 'Personal', icon: 'User' },
        { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart' }
      ]
    }
  },

  // Create a new category
  async createCategory(categoryData) {
    try {
      const apperClient = getApperClient()
      
      const params = {
        records: [
          {
            Name: categoryData.name,
            icon: categoryData.icon || 'Folder'
          }
        ]
      }

      const response = await apperClient.createRecord(CATEGORY_TABLE, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response.results?.[0]?.message || "Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  },

  // Delete a category
  async deleteCategory(categoryId) {
    try {
      const apperClient = getApperClient()
      
      const params = {
        RecordIds: [parseInt(categoryId)]
      }

      const response = await apperClient.deleteRecord(CATEGORY_TABLE, params)
      
      if (response && response.success) {
        return true
      } else {
        throw new Error("Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  }
}