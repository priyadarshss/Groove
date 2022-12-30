import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { Card, Button, ButtonGroup } from 'react-bootstrap'
import Jdenticon from 'react-jdenticon'
import { Divider, Grid, IconButton, Typography } from '@mui/material'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { SkipPrevious } from '@mui/icons-material'

const Home = ({ contract }) => {
  const audioRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(null)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [marketItems, setMarketItems] = useState(null)
  const artists = [
    'iFeature',
    'Dryskill & Max Brhon',
    'if found x Luma',
    'Jim Yosef & Shiah Maisel',
    'BEAUZ & Heleen',
    'SIIK & Alenn',
    "Andrew A & Barmuda",
    "JOXION"
  ]

  const songLinks = [
    'https://ncs.io/track/download/acf3c421-b007-49e0-8a73-7eae7f3382fa',
    'https://ncs.io/track/download/947408ff-0ebe-44fe-b024-212caffeb421',
    'https://ncs.io/track/download/8ed613ee-0ae9-4004-9e0d-2033f9a51c07',
    'https://ncs.io/track/download/a5bc205f-cbe5-4ed0-a4d9-bb91748f3c94',
    'https://ncs.io/track/download/388edba1-ce44-42ee-a478-039814aad24c',
    'https://ncs.io/track/download/a1f4b637-117c-44e5-a39d-d8d193a78fd6',
    'https://ncs.io/track/download/a33e3f44-76e0-45e5-8bca-927e2acab1df',
    'https://ncs.io/track/download/fac66b50-a790-4707-a73a-3bbe9ac0ef1c',
  ]
  const loadMarketplaceItems = async () => {
    // Get all unsold items/tokens

    const results = await contract.getAllUnsoldTokens()

    const marketItems = await Promise.all(
      results.map(async (i) => {
        // get uri url from contract
        const uri = await contract.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri + '.json')
        const metadata = await response.json()

        // define item object
        let item = {
          price: i.price,
          itemId: i.tokenId,
          name: metadata.name,
          audio: metadata.audio,
        }
        return item
      })
    )
    setMarketItems(marketItems)
    setLoading(false)
  }
  const buyMarketItem = async (item) => {
    await (await contract.buyToken(item.itemId, { value: item.price })).wait()
    loadMarketplaceItems()
  }
  const skipSong = (forwards) => {
    if (forwards) {
      setCurrentItemIndex(() => {
        let index = currentItemIndex
        index++
        if (index > marketItems.length - 1) {
          index = 0
        }
        return index
      })
    } else {
      setCurrentItemIndex(() => {
        let index = currentItemIndex
        index--
        if (index < 0) {
          index = marketItems.length - 1
        }
        return index
      })
    }
  }
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    } else if (isPlaying !== null) {
      audioRef.current.pause()
    }
  })

  useEffect(() => {
    !marketItems && loadMarketplaceItems()
  })

  useEffect(() => {
    document.body.style.backgroundColor = '#0c0c0c'
  }, [])

  if (loading)
    return (
      <main style={{ padding: '1rem 0' }}>
        <h2>Loading...</h2>
      </main>
    )
  return (
    <div
      style={{
        backgroundColor: '#061124',
      }}
    >
      <Grid container sx={{ marginTop: '15vh', justifyContent: 'center' }}>
        <Grid xs={1} sx={{ backgroundColor: '#0c0c0c' }}></Grid>
        <Grid xs={4} sx={{ height: '50vh' }}>
          <Grid>
            <div className='container-fluid'>
              {marketItems.length > 0 ? (
                <div className='row'>
                  <main
                    role='main'
                    className='col-lg-12 mx-auto'
                    style={{ maxWidth: '500px' }}
                  >
                    <div className='content mx-auto'>
                      <audio
                        src={marketItems[currentItemIndex].audio}
                        ref={audioRef}
                      ></audio>
                      <Card
                        style={{
                          backgroundColor: '#182438',
                          marginLeft: '-15px',
                          borderRadius: '20px',
                        }}
                      >
                        <Card.Header style={{ color: 'white' }}>
                          {currentItemIndex + 1} of {marketItems.length}
                        </Card.Header>
                        <Divider
                          sx={{
                            bgcolor: 'white',
                            marginBottom: '20px',
                          }}
                        />
                        <Jdenticon size='175' value={`${currentItemIndex}`} />
                        <Card.Body color='secondary'>
                          <Typography color='#e3dfd5' variant='h4'>
                            {' '}
                            {marketItems[currentItemIndex].name}
                          </Typography>
                        </Card.Body>
                        <Divider
                          sx={{
                            marginTop: '15px',
                            bgcolor: 'white',
                          }}
                        />
                        <Card.Footer>
                          <div className='d-grid my-1'>
                            <Button
                              onClick={() =>
                                buyMarketItem(marketItems[currentItemIndex])
                              }
                              style={{
                                backgroundColor: '#2d3b53',
                                borderColor: '#191329',
                              }}
                              variant='primary'
                              size='lg'
                            >
                              {`Buy for ${ethers.utils.formatEther(
                                marketItems[currentItemIndex].price
                              )} ETH`}
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </div>
                  </main>
                </div>
              ) : (
                <main style={{ padding: '1rem 0' }}>
                  <h2>No listed assets</h2>
                </main>
              )}
            </div>
          </Grid>
        </Grid>

        <Grid xs={6}>
          <Grid sx={{ display: 'flex', marginTop: 1 }}>
            <Grid xs={1}>
              <Typography color='#fcedd9'>#</Typography>
            </Grid>
            <Grid xs={5}>
              <Typography color='#fcedd9'>Title</Typography>
            </Grid>
            <Grid xs={4}>
              <Typography color='#fcedd9'>Artist</Typography>
            </Grid>
            <Grid xs={2}>
              <Typography color='#fcedd9'>V</Typography>
            </Grid>
          </Grid>
          <Divider
            sx={{
              marginTop: '10px',
              bgcolor: 'white',
            }}
          />

          {marketItems.map((item, i) => {
            return (
              <Grid container sx={{ marginTop: '5px' }}>
                <Grid xs={1}>
                  <Typography color='white'>{i + 1}</Typography>
                </Grid>
                <Grid xs={5}>
                  <Typography color='white'>{item.name}</Typography>
                </Grid>
                <Grid xs={4}>
                  <Typography color='white'>{artists[i]}</Typography>
                </Grid>
                <Grid xs={2}>
                  <IconButton
                    sx={{ color: 'white' }}
                    target='_blank'
                    href={songLinks[i]}
                  >
                    <DownloadRoundedIcon sx={{ cursor: 'pointer' }} />
                  </IconButton>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
        <Grid xs={1} sx={{ backgroundColor: '#0c0c0c' }}></Grid>

        <Grid container>
          <Grid xs={1} sx={{ backgroundColor: '#0c0c0c' }}></Grid>

          <Grid xs={10}>
            <div className='d-grid px-4'>
              <ButtonGroup
                class='btn-group btn-group-sm'
                role='group'
                size='sm'
                aria-label='Basic example'
              >
                <Button onClick={() => skipSong(false)}>
                  <SkipPrevious />
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='32'
                      height='32'
                      fill='currentColor'
                      className='bi bi-pause'
                      viewBox='0 0 16 16'
                    >
                      <path d='M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z' />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='32'
                      height='32'
                      fill='currentColor'
                      className='bi bi-play'
                      viewBox='0 0 16 16'
                    >
                      <path d='M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z' />
                    </svg>
                  )}
                </Button>
                <Button variant='secondary' onClick={() => skipSong(true)}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='22'
                    height='22'
                    fill='currentColor'
                    className='bi bi-skip-forward'
                    viewBox='0 0 16 16'
                  >
                    <path d='M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.752l-6.267 3.636c-.52.302-1.233-.043-1.233-.696v-2.94l-6.267 3.636C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696L7.5 7.248v-2.94c0-.653.713-.998 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5zM1 4.633v6.734L6.804 8 1 4.633zm7.5 0v6.734L14.304 8 8.5 4.633z' />
                  </svg>
                </Button>
              </ButtonGroup>
            </div>
          </Grid>
          <Grid xs={1} sx={{ backgroundColor: '#0c0c0c' }}></Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default Home
