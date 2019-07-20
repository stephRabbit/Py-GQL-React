import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import Lock from '@material-ui/icons/Lock'

import Error from '../Shared/Error'

const Login = ({ classes, setNewUser }) => {
  const [formData, setFormData] = useState({
    password: '',
    username: ''
  })

  const { password, username } = formData

  const onInputChange = e => {
    const el = e.target
    setFormData({ ...formData, [el.name]: el.value })
  }

  const handleSubmit = async (e, fn, client) => {
    e.preventDefault()
    try {
      const res = await fn()
      localStorage.setItem('pyAuthToken', res.data.tokenAuth.token)
      client.writeData({
        data: {
          isLoggedIn: true
        }
      })
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Lock />
        </Avatar>
        <Typography variant='title'>Login as Existing User</Typography>

        <Mutation mutation={LOGIN_MUTATION} variables={{ password, username }}>
          {(tokenAuth, { loading, error, called, client }) => {
            return (
              <form
                onSubmit={e => handleSubmit(e, tokenAuth, client)}
                className={classes.form}>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='username'>Username</InputLabel>
                  <Input
                    onChange={onInputChange}
                    name='username'
                    id='username'
                    value={username}
                  />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='password'>Password</InputLabel>
                  <Input
                    onChange={onInputChange}
                    name='password'
                    id='password'
                    type='password'
                    value={password}
                  />
                </FormControl>
                <Button
                  disabled={loading || !password.trim() || !username.trim()}
                  className={classes.submit}
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'>
                  {loading ? 'Logging in... ' : 'Login'}
                </Button>
                <Button
                  onClick={() => setNewUser(true)}
                  fullWidth
                  variant='outlined'
                  color='secondary'>
                  Not member? Register here
                </Button>

                {/* Handle Error */}
                {error && <Error error={error} />}
              </form>
            )
          }}
        </Mutation>
      </Paper>
    </div>
  )
}

const LOGIN_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`

const styles = theme => ({
  root: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up('md')]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.secondary.main
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
})

export default withStyles(styles)(Login)
