import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { taskService } from '../services/taskService'

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0, total: 0 })
  const [loadingStats, setLoadingStats] = useState(false)
  
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const categories = [
    { id: 'all', name: 'All Tasks', icon: 'List', count: 12, color: 'primary' },
    { id: 'work', name: 'Work', icon: 'Briefcase', count: 5, color: 'blue' },
    { id: 'personal', name: 'Personal', icon: 'User', count: 4, color: 'green' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', count: 3, color: 'orange' },
  ]

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadTaskStats()
  }, [isAuthenticated, navigate])

  const loadTaskStats = async () => {
    setLoadingStats(true)
    try {
      const allTasks = await taskService.fetchTasks('all')
      const completedTasks = allTasks.filter(task => task.completed)
      const pendingTasks = allTasks.filter(task => !task.completed)
      
      setTaskStats({
        completed: completedTasks.length,
        pending: pendingTasks.length,
        total: allTasks.length
      })
    } catch (error) {
      console.error("Failed to load task statistics:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const stats = [
    { label: 'Completed Tasks', value: taskStats.completed.toString(), icon: 'CheckCircle', color: 'text-secondary' },
    { label: 'Pending Tasks', value: taskStats.pending.toString(), icon: 'Clock', color: 'text-accent' },
    { label: 'Total Tasks', value: taskStats.total.toString(), icon: 'BarChart3', color: 'text-primary' },
  ]

  const handleLogout = async () => {
    await logout()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-surface-100 lg:hidden"
              >
                <ApperIcon name="Menu" className="w-6 h-6" />
              </motion.button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gradient">TaskFlow</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-surface-100"
              >
                <ApperIcon name="Search" className="w-5 h-5 text-surface-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-surface-100"
              >
                <ApperIcon name="Bell" className="w-5 h-5 text-surface-600" />
              </motion.button>
              
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full cursor-pointer flex items-center justify-center"
                >
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
                  </span>
                </motion.div>
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-surface-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-surface-200">
                    <p className="font-medium text-surface-900">{user?.firstName || 'User'}</p>
                    <p className="text-sm text-surface-600">{user?.emailAddress}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            width: sidebarCollapsed ? '0px' : '280px'
          }}
          className={`bg-white border-r border-surface-200 fixed lg:relative h-full z-40 transition-all duration-300 ${
            sidebarCollapsed ? 'w-0 overflow-hidden lg:w-72' : 'w-72'
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Overview</h3>
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-50"
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-sm font-medium text-surface-700">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {loadingStats && (
                      <div className="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span className="text-lg font-bold text-surface-900">{stat.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Categories</h3>
              {categories.map((category, index) => (
                <motion.div 
                  key={category.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`sidebar-item ${index === 0 ? 'sidebar-item-active' : ''}`}
                >
                  <ApperIcon name={category.icon} className="w-5 h-5 mr-3" />
                  <span className="flex-1">{category.name}</span>
                  <span className="bg-surface-200 text-surface-600 text-xs px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Progress</h3>
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-700">Daily Goal</span>
                  <span className="text-sm font-bold text-primary">{taskStats.completed}/10</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((taskStats.completed / 10) * 100, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <MainFeature />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {!sidebarCollapsed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

export default Home