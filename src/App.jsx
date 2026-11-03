import { useState } from 'react'
import './App.css'

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <header className="header">
        <div className="headerLeft">
          <span>Blog</span>
          <div className="headerSearch">
            <input type="text" placeholder="Search" />
          </div>
        </div>
        
        <div className="headerRight">
          <div className="headerSelect">English</div>
          <div className="headerSelect">Follow system</div>
        </div>
      </header>

      <div className={'main' + (collapsed ? ' collapsed' : '')}>
        <div className={'mainLeft' + (collapsed ? ' collapsed' : '')}>
          11111
        </div>

        <div className="mainRight">
          <button
            id="collapseBtn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? '展开' : '折叠'}
          >
            {collapsed ? '>' : '<'}
          </button>

          <div className="content">
            2222
          </div>
        </div>
      </div>
    </>
  )
}

export default App
