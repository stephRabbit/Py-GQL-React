import React, { useContext } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import IconButton from '@material-ui/core/IconButton'
import TrashIcon from '@material-ui/icons/DeleteForeverOutlined'

import { UserContext } from '../../Root'
import { GET_TRACKS_QUERY } from '../../pages/App'
import Error from '../Shared/Error'

const DeleteTrack = ({ track }) => {
  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === track.postedBy.id

  const handleUpdateCache = (cache, { data: { deleteTrack } }) => {
    const data = cache.readQuery({ query: GET_TRACKS_QUERY })
    //const tracks = data.tracks.filter(track => Number(track.id) !== deleteTrack.trackId)
    const index = data.tracks.findIndex(
      track => Number(track.id) === deleteTrack.trackId
    )

    const tracks = [
      ...data.tracks.slice(0, index), // Slice array 0 to found index and ommit index
      ...data.tracks.slice(index + 1) // and spread all data after
    ]
    cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } })
  }
  return (
    isCurrentUser && (
      <Mutation
        mutation={DELETE_TRACK_MUTATION}
        variables={{ trackId: track.id }}
        update={handleUpdateCache}
        //refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
      >
        {(deleteTrack, { error }) => {
          if (error) {
            return <Error error={error} />
          }
          return (
            <IconButton onClick={deleteTrack}>
              <TrashIcon />
            </IconButton>
          )
        }}
      </Mutation>
    )
  )
}

const DELETE_TRACK_MUTATION = gql`
  mutation($trackId: Int!) {
    deleteTrack(trackId: $trackId) {
      trackId
    }
  }
`

export default DeleteTrack
