import React from 'react'
import Applayout from '../components/layout/Applayout'
import { Typography,Box } from '@mui/material'
import { graycolor } from '../constants/Color'

const Home = () => {
  return (
   <Box bgcolor={graycolor} height={"100%"}> 
    <Typography p={"2rem"} variant='h5' textAlign={'center'}>Select a friend to chat</Typography>
    </Box>
  )
}

export default Applayout()(Home)