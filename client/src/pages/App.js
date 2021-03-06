import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from '@material-ui/core/styles/withStyles'

import SearchTracks from '../components/Track/SearchTracks'
import TrackList from '../components/Track/TrackList'
import CreateTrack from '../components/Track/CreateTrack'
import Loading from '../components/Shared/Loading'
import Error from '../components/Shared/Error'

const App = ({ classes }) => {
  const [searResults, setSearchResults] = useState([])
  return (
    <div className={classes.container}>
      <SearchTracks setSearchResults={setSearchResults} />
      <CreateTrack />
      <Query query={GET_TRACKS_QUERY}>
        {({ data: { tracks }, loading, error }) => {
          if (error) return <Error error={error} />
          if (loading) return <Loading />

          return (
            <TrackList tracks={searResults.length > 0 ? searResults : tracks} />
          )
        }}
      </Query>
    </div>
  )
}

export const GET_TRACKS_QUERY = gql`
  query getTracksQuery {
    tracks {
      id
      title
      description
      url
      likes {
        id
      }
      postedBy {
        id
        username
      }
    }
  }
`

const styles = theme => ({
  container: {
    margin: '0 auto',
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
})

export default withStyles(styles)(App)
