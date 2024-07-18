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
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import hashwrap from 'hash-wrap'
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
  const [getEnvelope, setGetEnvelope] = useState(false)
  const [txid, setTxid] = useState<string>('')
  const [cache, setCache] = useState<{ [key: string]: any }>({})
  const [beefLength, setBeefLength] = useState<number | null>(null)
  const [envelopeLength, setEnvelopeLength] = useState<number | null>(null)
  const theme = useTheme()

  const handleGetEnvelopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGetEnvelope(event.target.checked)
    updateEnvelopeField(txid, event.target.checked)
  }

  const handleNetworkChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setTxid('')
    setEnvelope(null)
    setError(null)
  }

  const handleTxidChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEnvelopeField(e.target.value, getEnvelope)
    setTxid(e.target.value)
  }

  const handleTxidFocus = () => {
    setTxid('')
    setEnvelope(null)
    setError(null)
    setBeefLength(null)
    setEnvelopeLength(null)
  }

  const updateEnvelopeField = async (txid: string, getEnvelope?: boolean) => {
    if (txid.length !== 64) {
      if (txid === '') {
        setEnvelope(null)
      }
      setError(null)
      return
    }

    const network = tabValue === 0 ? 'mainnet' : 'testnet'
    const cacheKey = `${network}-${txid}-${getEnvelope ? 'envelope' : 'beef'}`

    // Check if the result is in the cache
    if (cache[cacheKey]) {
      const cachedResult = cache[cacheKey]
      setEnvelope(cachedResult)
      if (getEnvelope) {
        setEnvelopeLength(JSON.stringify(cachedResult).length)
      } else {
        setBeefLength(JSON.stringify(cachedResult).length)
      }
      return
    }

    try {
      setLoading(true)
      setEnvelope(null)
      let options: HashwrapOptions = { network }
      if (network === 'testnet') {
        options.taalApiKey = process.env.REACT_APP_TAAL_TESTNET_API_KEY || ''
        options.format = getEnvelope ? undefined : 'beefHex'
      }
      const result = await hashwrap(txid, options)
      setEnvelope(result)
      setCache(prevCache => ({ ...prevCache, [cacheKey]: result })) // Cache the result
      setError(null)
      if (getEnvelope) {
        setEnvelopeLength(JSON.stringify(result).length)
      } else {
        setBeefLength(JSON.stringify(result).length)
      }
    } catch (e: any) {
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledContainer maxWidth={false}>
      <Grid container spacing={3} justifyContent='center'>
        <Grid item xs={12}>
          <Typography
            variant='h2'
            align='center'
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
          <Typography variant='h5' align='center' sx={{ marginBottom: theme.spacing(5) }} paragraph>
            Enter a TXID, get an SPV
            &nbsp;<a href='https://github.com/bitcoin-sv/BRCs/blob/0eae30a933896be7a39f5c80c43b4475332ffed5/transactions/0062.md'>BEEF</a>&nbsp;
            (Background Evaluation Extended Format)
          </Typography>
          <Typography variant='h6' align='center' sx={{ marginBottom: theme.spacing(5) }} paragraph>
            (currently testnet only and you can retrieve your Envelope[deprecated] using checkbox selection)
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleNetworkChange} aria-label='select mainnet or testnet' centered>
            <Tab label='mainnet' />
            <Tab label='testnet' />
          </Tabs>
        </Grid>
        <Grid item xs={11}>
          <TextField
            value={txid}
            onChange={handleTxidChange}
            onFocus={handleTxidFocus}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter') {
                handleTxidChange({
                  target: { value: (e.target as HTMLInputElement).value } as any
                } as React.ChangeEvent<HTMLInputElement>)
              }
            }}
            label='Bitcoin SV TXID'
            fullWidth
            disabled={loading}
            error={!!error}
            helperText={error}
            variant='outlined'
            autoFocus
          />
        </Grid>
        {tabValue === 1 && (
          <Grid item xs={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={getEnvelope}
                  onChange={handleGetEnvelopeChange}
                  color='primary'
                />
              }
              label='your envelope(deprecated)'
            />
          </Grid>
        )}
        {loading && (
          <>
            <Grid item xs={12}>
              <Typography sx={{ marginTop: theme.spacing(5) }} align='center' color='textSecondary' paragraph>
                {tabValue === 0 || getEnvelope
                  ? <i>Preparing your Envelope(deprecated)...</i>
                  : <i>Preparing your BEEF...</i>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          </>
        )}
        {envelope && (
          <>
            <Grid item xs={12} sx={{ marginTop: theme.spacing(5) }}>
              <Typography variant='h4' align='center'>
                Your 
                {tabValue === 0 || getEnvelope
                  ? <b> Envelope </b>
                  : <b> BEEF </b>} 
                is ready, good sir!
              </Typography>
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
            <Grid item xs={12} sx={{ marginTop: theme.spacing(5) }}>
              <Typography variant='h6' align='center'>
                {tabValue === 1 && envelopeLength && beefLength && (
                  <>
                    <p>Envelope length: {envelopeLength} characters</p>
                    <p>BEEF length: {beefLength} characters</p>
                    <p>BEEF is {(envelopeLength - beefLength)} characters shorter, {(100 * (envelopeLength - beefLength) / envelopeLength).toFixed(2)}% more efficient</p>
                  </>
                )}
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12} sx={{ marginTop: theme.spacing(10) }}>
          <Typography variant='h4'>
            <b>What is this?</b>
          </Typography>
          <Typography paragraph>
            This is a website where you can generate SPV
            &nbsp;<a href='https://github.com/bitcoin-sv/BRCs/blob/0eae30a933896be7a39f5c80c43b4475332ffed5/transactions/0062.md'>BEEF</a>&nbsp;
            for a transaction, given its TXID. An SPV BEEF is a way to
            represent a Bitcoin transaction that allows it to be handed to its
            recipients and verified by an SPV client without the
            need for any other information. Currently, mainnet returns an SPV envelope and testnet by default returns a BEEF.
            You can request the equivalent testnet Envelope(deprecated) but this is far less efficient and discouraged.
          </Typography>
          <Typography variant='h4'>
            <b>Where's the code?</b>
          </Typography>
          <Typography paragraph>
            If you have any questions, please reach out to the Babbage Team.
          </Typography>
          <Typography paragraph>
            The code is on <a href='https://github.com/p2ppsr/hashwrap'>GitHub</a>.
          </Typography>
        </Grid>
      </Grid>
    </StyledContainer>
  )
}

export default App
