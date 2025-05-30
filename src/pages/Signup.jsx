import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useContext } from 'react'
import { AuthContext } from '../App'
import ApperIcon from '../components/ApperIcon'

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isInitialized } = useContext(AuthContext)

  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
    }
  }, [isInitialized])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-2xl shadow-2xl border border-surface-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">TaskFlow</h1>
          </div>
          <h2 className="text-3xl font-bold text-surface-800">Create Account</h2>
          <p className="mt-2 text-surface-600">Start organizing your tasks today</p>
        </div>
        
        <div id="authentication" className="min-h-[400px]" />
        
        <div className="text-center mt-6">
          <p className="text-sm text-surface-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup