import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const categories = [
    { id: 'all', name: 'All Tasks', icon: 'List', count: 12, color: 'primary' },
    { id: 'work', name: 'Work', icon: 'Briefcase', count: 5, color: 'blue' },
    { id: 'personal', name: 'Personal', icon: 'User', count: 4, color: 'green' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', count: 3, color: 'orange' },
  ]

  const stats = [
    { label: 'Completed Today', value: '8', icon: 'CheckCircle', color: 'text-secondary' },
    { label: 'Pending Tasks', value: '4', icon: 'Clock', color: 'text-accent' },
    { label: 'Total Tasks', value: '12', icon: 'BarChart3', color: 'text-primary' },
  ]

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
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
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
                  <span className="text-lg font-bold text-surface-900">{stat.value}</span>
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
                  <span className="text-sm font-bold text-primary">8/10</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
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