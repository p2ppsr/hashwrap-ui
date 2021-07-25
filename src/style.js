const style = theme => ({
  content_wrap: {
    maxWidth: '1440px',
    margin: `${theme.spacing(3)}px auto`
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2em'
    }
  },
  subtitle: {
    marginBottom: theme.spacing(10)
  },
  env_container: {
    marginTop: theme.spacing(5)
  },
  loading_text: {
    marginTop: theme.spacing(5)
  },
  envelope: {
    borderRadius: theme.spacing(0.5),
    boxShadow: theme.shadows[5],
    overflowX: 'scroll',
    boxSizing: 'border-box',
    padding: theme.spacing(2),
    userSelect: 'all'
  },
  info_wrap: {
    marginTop: theme.spacing(10)
  }
})

export default style
