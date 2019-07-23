import React, { useState, useContext } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import axios from 'axios'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic'

import { UserContext } from '../../Root'
import Error from '../Shared/Error'

const UpdateTrack = ({ classes, track }) => {
  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === track.postedBy.id
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fileError, setFileError] = useState('')
  const [formData, setFormData] = useState({
    title: track.title,
    description: track.description,
    fileName: ''
  })

  const { title, description } = formData

  const handleInputChange = e => {
    const el = e.target
    setFormData({
      ...formData,
      [el.name]: el.value
    })
  }

  const handleAudioChange = e => {
    const selectFile = e.target.files[0]
    const fileSizeLimit = 10000000 // 10mb
    if (selectFile && selectFile.size >= fileSizeLimit) {
      setFileError(`${selectFile.name}: File size is to large (max 10MB).`)
    } else {
      setFile(selectFile)
      setFileError('')
    }
  }

  const handleAudioUpload = async () => {
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('resource_type', 'raw')
      data.append('upload_preset', 'py-tracks')
      data.append('cloud_name', 'deh8c4opq')
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/deh8c4opq/raw/upload',
        data
      )
      return res.data.url
    } catch (err) {
      console.error('Error uploading file', err)
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e, fn) => {
    e.preventDefault()
    setSubmitting(true)
    // Upload audio to and get return url from Cloudinary API
    const url = await handleAudioUpload()
    fn({
      variables: {
        description,
        title,
        url,
        trackId: track.id
      }
    })
  }

  return (
    isCurrentUser && (
      <>
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
        <Mutation
          mutation={UPDATE_TRACK_MUTATION}
          onCompleted={data => {
            console.log(data)
            setOpen(false)
            setSubmitting(false)
          }}>
          {(updateTrack, { error }) => {
            if (error) {
              return <Error error={error} />
            }
            return (
              <Dialog open={open} className={classes.dialog}>
                <form onSubmit={e => handleSubmit(e, updateTrack)}>
                  <DialogTitle>Create Track</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Add a Title, Description & Audio File (under 10MB)
                    </DialogContentText>
                    <FormControl fullWidth>
                      <TextField
                        label='Title'
                        placeholder='Add Title'
                        className={classes.textField}
                        name='title'
                        value={title}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        rows='2'
                        label='Description'
                        placeholder='Add Description'
                        className={classes.textField}
                        name='description'
                        value={description}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl fullWidth error={!!fileError}>
                      <input
                        className={classes.input}
                        id='audio'
                        required
                        type='file'
                        accept='audio/mp3,audio/wav'
                        name='fileName'
                        onChange={handleAudioChange}
                      />
                      <label htmlFor='audio'>
                        <Button
                          variant='outlined'
                          color={file ? 'secondary' : 'inherit'}
                          component='span'
                          className={classes.button}>
                          Audio File
                          <LibraryMusicIcon className={classes.icon} />
                        </Button>
                        {file && file.name}
                        <FormHelperText>{fileError}</FormHelperText>
                      </label>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      disabled={submitting}
                      onClick={() => {
                        setOpen(false)
                      }}
                      className={classes.cancel}>
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        submitting ||
                        !file ||
                        !title.trim() ||
                        !description.trim()
                      }
                      className={classes.save}
                      type='submit'>
                      {submitting ? (
                        <CircularProgress className={classes.save} size={24} />
                      ) : (
                        'Update Track'
                      )}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            )
          }}
        </Mutation>
      </>
    )
  )
}

const UPDATE_TRACK_MUTATION = gql`
  mutation($trackId: Int!, $title: String, $description: String, $url: String) {
    updateTrack(
      trackId: $trackId
      title: $title
      description: $description
      url: $url
    ) {
      track {
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
  }
`

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dialog: {
    margin: '0 auto',
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: 'red'
  },
  save: {
    color: 'green'
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
})

export default withStyles(styles)(UpdateTrack)
