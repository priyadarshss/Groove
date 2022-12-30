import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { ethers } from 'ethers'
import GrooveMarketplaceAbi from '../contractsData/GrooveMarketplace.json'
import GrooveMarketplaceAddress from '../contractsData/GrooveMarketplace-address.json'
import { Spinner, Nav } from 'react-bootstrap'
import logo from '../../images/logo.jpg'
import Home from './Home.js'
import MyTokens from './MyTokens.js'
import MyResales from './MyResales.js'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState({})
  const [anchorElNav, setAnchorElNav] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Get signer
    const signer = provider.getSigner()
    loadContract(signer)
  }
  const loadContract = async (signer) => {
    // Get deployed copy of music nft marketplace contract
    const contract = new ethers.Contract(
      GrooveMarketplaceAddress.address,
      GrooveMarketplaceAbi.abi,
      signer
    )
    setContract(contract)
    setLoading(false)
  }
  return (
    <BrowserRouter>
      <div className='App'>
        <AppBar position='static' style={{ background: '#2E3B55' }}>
          <Container maxWidth='xl'>
            <Toolbar disableGutters>
              <img
                src={logo}
                width='40'
                height='40'
                className=''
                alt=''
                style={{ borderRadius: '50px', marginRight: '10px' }}
              />
              <Typography
                variant='h6'
                noWrap
                component='a'
                href='/'
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#d1c5ab',
                  textDecoration: 'none',
                }}
              >
                GROOVE
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleOpenNavMenu}
                  color='inherit'
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to='/'
                  >
                    <Typography textAlign='center'>Home</Typography>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to='/my-tokens'
                  >
                    <Typography textAlign='center'>My Tokens</Typography>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to='/my-resales'
                  >
                    <Typography textAlign='center'>My Resales</Typography>
                  </MenuItem>
                </Menu>
              </Box>
              <Typography
                variant='h5'
                noWrap
                component='a'
                href=''
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#d1c5ab',
                  textDecoration: 'none',
                }}
              >
                GROOVE
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  component={Link}
                  to='/'
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  to='/my-tokens'
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  My Tokens
                </Button>
                <Button
                  component={Link}
                  to='/my-resales'
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  My Resales
                </Button>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                {account ? (
                  <Nav.Link
                    href={`https://etherscan.io/address/${account}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='button nav-button btn-sm mx-4'
                  >
                    <Button variant='outline-light'>
                      {account.slice(0, 5) + '...' + account.slice(38, 42)}
                    </Button>
                  </Nav.Link>
                ) : (
                  <Button onClick={web3Handler} variant='outline-light'>
                    Connect Wallet
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <div>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
              }}
            >
              <Spinner animation='border' style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path='/' element={<Home contract={contract} />} />
              <Route
                path='/my-tokens'
                element={<MyTokens contract={contract} />}
              />
              <Route
                path='/my-resales'
                element={<MyResales contract={contract} account={account} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
