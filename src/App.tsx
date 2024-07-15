import React, { useState } from 'react'
import {
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  LinearProgress,
  Grid,
  useTheme,
  styled,
} from '@mui/material'
import hashwrap from '../../hashwrap'
import './App.scss'

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1440px',
  margin: `${theme.spacing(3)}px auto`,
}))

interface HashwrapOptions {
  network: string
  taalApiKey?: string
  format?: 'beefHex'
}

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [envelope, setEnvelope] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  const handleNetworkChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length !== 64) {
      if (value === '') {
        setEnvelope(null)
      }
      setError(null)
      return
    }

    try {
      setLoading(true)
      setEnvelope(null)
      let options: HashwrapOptions = { network: 'mainnet' }
      if (tabValue === 1) {
        options = {
          network: 'testnet',
          taalApiKey: process.env.REACT_APP_TAAL_TESTNET_API_KEY || '',
          format: 'beefHex'
        }
      }
      const result = await hashwrap(value, options)
      setEnvelope(result)
      setError(null)
    } catch (e: any) {
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledContainer maxWidth={false}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Typography
            variant="h2"
            align="center"
            sx={{
              [theme.breakpoints.down('sm')]: {
                fontSize: '2em',
              },
              paddingTop: '1em'
            }}
          >
            <b>HASHWRAP</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" sx={{ marginBottom: theme.spacing(5) }} paragraph>
            Enter a TXID, get an SPV Envelope.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleNetworkChange} aria-label="select mainnet or testnet" centered>
            <Tab label="mainnet" />
            <Tab label="testnet" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter') {
                handleChange({
                  target: { value: (e.target as HTMLInputElement).value } as any
                } as React.ChangeEvent<HTMLInputElement>)
              }
            }}
            label="Bitcoin SV TXID"
            fullWidth
            disabled={loading}
            error={!!error}
            helperText={error}
            variant="outlined"
            autoFocus
          />
        </Grid>
        {loading && (
          <>
            <Grid item xs={12}>
              <Typography sx={{ marginTop: theme.spacing(5) }} align="center" color="textSecondary" paragraph>
                <i>Preparing your Envelope...</i>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          </>
        )}
        {envelope && (
          <Grid item xs={12} sx={{ marginTop: theme.spacing(5) }}>
            <Typography variant="h4" align="center">Your Envelope is ready, good sir!</Typography>
            <pre
              style={{
                borderRadius: theme.spacing(0.5),
                boxShadow: theme.shadows[5],
                overflowX: 'scroll',
                boxSizing: 'border-box',
                padding: theme.spacing(2),
                userSelect: 'all',
              }}
            >
              {JSON.stringify(envelope, null, 2)}
            </pre>
          </Grid>
        )}
        <Grid item xs={12} sx={{ marginTop: theme.spacing(10) }}>
          <Typography variant="h4">
            <b>What is this?</b>
          </Typography>
          <Typography paragraph>
            This is a website where you can generate SPV Envelopes for any transaction, given its TXID. An SPV Envelope is a way to
            represent a Bitcoin transaction that allows it to be handed to its recipients and verified by an SPV client without the
            need for any other information.
          </Typography>
          <Typography variant="h4">
            <b>Where's the code?</b>
          </Typography>
          <Typography paragraph>
            You should reach out to Ty Everett, the creator of this website and the author of the SPV Envelope specifications, if you
            have questions. He can be found in the{' '}
            <a href="https://atlantis.planaria.network">Atlantis Developers Slack</a> group, or the ICU. A formal specification will
            be released publicly soon, hopefully through the Bitcoin Association's TSC process.
          </Typography>
          <Typography paragraph>
            The code is on <a href="https://github.com/p2ppsr/hashwrap">GitHub</a>.
          </Typography>
        </Grid>
      </Grid>
    </StyledContainer>
  )
}

export default App
