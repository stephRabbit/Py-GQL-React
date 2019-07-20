import React, { useState, useRef } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import ClearIcon from '@material-ui/icons/Clear'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'

const SearchTracks = ({ classes, setSearchResults }) => {
  const [search, setSearach] = useState('')
  const inputEl = useRef()

  const clearSearchInput = e => {
    setSearchResults([])
    setSearach('')
    inputEl.current.focus()
  }

  const handleSubmit = async (e, client) => {
    e.preventDefault()
    if (!search) {
      return
    }

    try {
      const res = await client.query({
        query: SEARCH_TRACKS_QUERY,
        variables: { search }
      })
      console.log(res)
      setSearchResults(res.data.tracks)
    } catch (err) {
      console.err('SEARCH_TRACKS_QUERY', err)
    }
  }

  return (
    <ApolloConsumer>
      {client => {
        return (
          <form onSubmit={e => handleSubmit(e, client)}>
            <Paper className={classes.root} elevation={1}>
              <IconButton onClick={clearSearchInput}>
                <ClearIcon />
              </IconButton>
              <TextField
                inputRef={inputEl}
                fullWidth
                placeholder='Search All Tracks'
                InputProps={{
                  disableUnderline: true
                }}
                onChange={e => setSearach(e.target.value)}
                value={search}
              />
              <IconButton type='submit'>
                <SearchIcon />
              </IconButton>
            </Paper>
          </form>
        )
      }}
    </ApolloConsumer>
  )
}

const SEARCH_TRACKS_QUERY = gql`
  query($search: String) {
    tracks(search: $search) {
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
  root: {
    padding: '2px 4px',
    margin: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center'
  }
})

export default withStyles(styles)(SearchTracks)
