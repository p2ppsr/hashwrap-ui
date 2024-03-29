import React, { useState } from 'react'
import hashwrap from 'hash-wrap'
import {
  Tabs,
  Tab,
  Typography,
  TextField,
  LinearProgress
} from '@material-ui/core'
import style from './style'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(style, {
  name: 'Hashwrap'
})

const App = () => {
  const [tabValue, setTabValue] = useState(0)
  const [envelope, setEnvelope] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  const handleNetworkChange = (e, newValue) => {
    setTabValue(newValue)
  }

  const handleChange = async e => {
    if (e.target.value.length !== 64) {
      if (e.target.value === '') {
        setEnvelope(null)
      }
      setError(null)
      return
    }
    try {
      setLoading(true)
      setEnvelope(null)
      let options
      if (tabValue === 1) {
        options = {
          network: 'testnet',
          taalApiKey: process.env.REACT_APP_TAAL_TESTNET_API_KEY
        }
      }
      setEnvelope(await hashwrap(e.target.value, options))
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <center>
        <Typography
          className={classes.title}
          variant='h2'
        >
          <b>HASHWRAP</b>
        </Typography>
        <Typography className={classes.subtitle} paragraph>
          Enter a TXID, get an SPV Envelope.
        </Typography>
        <Tabs value={tabValue} onChange={handleNetworkChange} aria-label="select mainnet or testnet">
          <Tab label="mainnet"/>
          <Tab label="testnet"/>
        </Tabs>
        <br/>        
        <TextField
          onChange={handleChange}
          label='Bitcoin SV TXID'
          fullWidth
          disabled={loading}
          error={!!error}
          helperText={error}
          variant='outlined'
          autoFocus
        />
      </center>
      {loading && (
        <>
          <Typography
            className={classes.loading_text}
            align='center'
            color='textSecondary'
            paragraph
          >
            <i>Preparing your Envelope...</i>
          </Typography>
          <LinearProgress />
        </>
      )}
      {envelope && (
        <div className={classes.env_container}>
          <Typography variant='h4'>
            Your Envelope is ready, good sir!
          </Typography>
          <pre className={classes.envelope}>
            {JSON.stringify(envelope, null, 2)}
          </pre>
        </div>
      )}
      <div className={classes.info_wrap}>
        <Typography variant='h4'><b>What is this?</b></Typography>
        <Typography paragraph>
          This is a website where you can generate SPV Envelopes for any transaction, given its TXID. An SPV Envelope is a way to represent a Bitcoin transaction that allows it to be handed to its recipients and verified by an SPV client without the need for any other information.
        </Typography>
        <Typography variant='h4'><b>Where's the code?</b></Typography>
        <Typography paragraph>
          You should reach out to Ty Everett, the creator of this website and the author of the SPV Envelope specifications, if you have questions. He can be found in the <a href='https://atlantis.planaria.network'>Atlantis Developers Slack</a> group, or the ICU. A formal specification will be released publicly soon, hopefully through the Bitcoin Association's TSC process.
        </Typography>
        <Typography paragraph>
          The code is on <a href='https://github.com/p2ppsr/hashwrap'>GitHub</a>.
        </Typography>
      </div>
    </div>
  )
}

export default App
