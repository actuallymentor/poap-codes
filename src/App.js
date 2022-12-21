import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Theme from './components/atoms/Theme'
import Homepage from './components/organisms/Homepage'
import StatusChecker from './components/organisms/StatusChecker'
import Airdrop from './components/organisms/Airdrop'
import { listen_to_document } from './modules/firebase'

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

  return <Theme>

      <Router>

        <Routes>

          <Route exact path='/' element={ <Homepage /> } />
          <Route exact path='/status' element={ <StatusChecker /> } />
          <Route exact path='/airdrop' element={ <Airdrop /> } />

        </Routes>

      </Router>

  </Theme>
  
}