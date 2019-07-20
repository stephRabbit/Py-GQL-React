import React from 'react'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import withRoot from './withRoot'
import Header from './components/Shared/Header'
import App from './pages/App'
import Profile from './pages/Profile'
import Loading from './components/Shared/Loading'
import Error from './components/Shared/Error'

const Root = () => (
  <Query query={ME_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />
      if (error) return <Error error={error} />

      return (
        <Router>
          <>
            <Header currentUser={data.me} />
            <Switch>
              <Route exact path='/' component={App} />
              <Route path='/profile/:id' component={Profile} />
            </Switch>
          </>
        </Router>
      )
    }}
  </Query>
)
// const GET_TRACKS_QUERY = gql`
//   {
//     tracks {
//       title
//       createdAt
//     }
//   }
// `

const ME_QUERY = gql`
  query {
    me {
      username
      id
    }
  }
`

export default withRoot(Root)
