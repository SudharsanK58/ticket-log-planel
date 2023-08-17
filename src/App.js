import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Alert, AlertTitle } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { Radio, RadioGroup,FormControlLabel } from '@mui/material';



function App() {
  const [tickets, setTickets] = useState({});
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [bleTxPowerValue, setBleTxPowerValue] = useState(null);
  const [ibeaconMajorValue, setIbeaconMajorValue] = useState('');
  const [ibeaconMinorValue, setIbeaconMinorValue] = useState('');
  const [bleDfuModeValue, setBleDfuModeValue] = useState(false);



  

  const cards = [
    { name: "LED validator", token: "04:e9:e5:14:90:26" },
    { name: "Display validator", token: "04:e9:e5:14:91:41" },
    { name: "Device 2", token: "04:e9:e5:14:91:23" }
  ];
  const [selectedCardToken, setSelectedCardToken] = useState(cards[0].token); 

  const fetchData = (token) => {
    setLoading(true);
    setError(null);  // Reset error before making a new request
  
    axios.get(`http://mqtt.zusan.in:8081/getDeviceData?deviceId=${token}`)
      .then(response => {
        if (response.data === "device not found") { // 2. Check for error message
          setError("device not found");
          setLoading(false);
        } else {
          setTickets(response.data);
          setBleTxPowerValue(response.data.ble.bleTxPower);
          setIbeaconMajorValue(response.data.ble.ibeaconMajor);
          setIbeaconMinorValue(response.data.ble.ibeaconMinor);
          setBleDfuModeValue(response.data.ble.bleDfuMode);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedCardToken);
  }, [selectedCardToken]);  // added dependency to refresh on token change
  
  return (
    <div className="App">
      <Typography variant="h4" gutterBottom align="center" marginTop= "2%">
        Device config panel
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
        <FormControl variant="outlined" size="small">
          <Select 
            value={selectedCardToken} 
            onChange={(e) => {
              setSelectedCardToken(e.target.value);
              fetchData(e.target.value);
            }}
            style={{ marginRight: '10px', width: '200px' }}
          >
            {cards.map(card => (
              <MenuItem key={card.token} value={card.token}>{card.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => fetchData(selectedCardToken)}>Reload</Button>
        <Button variant="contained">Update device</Button>
      </Stack>

      {/* Conditional Rendering */}
      {loading ? (
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
          <CircularProgress style={{ marginTop: '20px' }}/>
        </Stack>
      ) : error ? (  // 3. Conditional rendering based on error state
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
      <Alert severity="info" style={{marginTop: '20px',width: '20%'}}>
        <AlertTitle>Info</AlertTitle>
        Invalid device or no data regsisted for this device
      </Alert>
      </Stack>
      ) :  (
      <TableContainer component={Paper} style={{ marginTop: '30px', overflow: "auto" }}>
        <Table>
          {/* <TableHead>
            <TableRow>
              <TableCell>Section</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
          {Object.entries(tickets).map(([section, data]) => {
            let color, displaySectionName;
            switch (section) {
              case 'ble':
                color = 'blue';
                displaySectionName = 'Beacon Configuration';
                break;
              case 'mqtt':
                color = 'green';
                displaySectionName = 'MQTT Network Configuration';
                break;
              case 'validation':
                color = 'red';
                displaySectionName = 'Device Validation Configuration';
                break;
              default:
                color = 'inherit';
                displaySectionName = section;
                break;
            }

              return Object.entries(data).map(([key, value], idx) => (
                <TableRow key={key}>
                  {idx === 0 && (
                    <TableCell rowSpan={Object.keys(data).length} style={{ fontWeight: 'bold', fontSize: '1.9em', color: color, textAlign: 'center' ,width: '450px'}}>
                    {displaySectionName} {/* Display the renamed section name */}
                  </TableCell>
                  )}
                  <TableCell style={{ color: color , fontSize: '1.1em'}}>{key}</TableCell>
                  {/* <TableCell style={{ color: color , fontSize: '1.0em',width: '550px'}}>{typeof value === 'boolean' ? value.toString() : value}</TableCell> */}
                  <TableCell style={{ color: color , fontSize: '1.0em',width: '550px'}}>
                  {key === 'bleTxPower' ? (
                    <Box sx={{ Width: 40 }}>
                      <FormControl style={{width:"40%"}}>
                        <InputLabel id="demo-simple-select-label">Validation Mode</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={bleTxPowerValue}
                          label="Validation Mode"
                          onChange={(event) => {
                            setBleTxPowerValue(event.target.value);
                            console.log(`The updated bleTxPower is ${event.target.value}`);
                          }}                          
                        >
                          <MenuItem value={-4}>Ticket validation</MenuItem>
                          <MenuItem value={4}>Long range validation</MenuItem>
                          <MenuItem value={0}>Mid range validation</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ) : key === 'ibeaconMajor' ? (
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl style={{width:"40%"}}>
                        <InputLabel id="ibeaconMajor-label">Beacon Type</InputLabel>
                        <Select
                          labelId="ibeaconMajor-label"
                          id="ibeaconMajor-select"
                          value={ibeaconMajorValue}
                          label="Beacon Type"
                          onChange={(event) => {
                            setIbeaconMajorValue(event.target.value);
                            console.log(`The updated ibeaconMajor is ${event.target.value}`);
                          }}
                        >
                          <MenuItem value={100}>Ticket beacon</MenuItem>
                          <MenuItem value={102}>Beverage beacon</MenuItem>
                          <MenuItem value={103}>Out data beacon</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ) : key === 'ibeaconMinor' ? (
                    <TextField style={{width:"40%"}}
                      id="ibeaconMinor-textfield"
                      label="iBeacon Minor"
                      variant="outlined"
                      type="number"
                      value={ibeaconMinorValue}
                      onChange={(event) => {
                        setIbeaconMinorValue(event.target.value);
                        console.log(`The updated ibeaconMinor is ${event.target.value}`);
                      }}
                      inputProps={{
                        inputMode: 'numeric', // this ensures the mobile keyboard is numeric
                        pattern: "[0-9]*"     // this ensures only numeric input is allowed
                      }}
                    />
                  ) : key === 'bleDfuMode' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="bleDfuMode-radio-group"
                        value={bleDfuModeValue ? "enabled" : "disabled"}
                        onChange={(event) => {
                          setBleDfuModeValue(event.target.value === "enabled");
                          console.log(`The updated bleDfuMode is ${event.target.value === "enabled"}`);
                        }}
                      >
                        <FormControlLabel value="enabled" control={<Radio />} label="DFU enabled" />
                        <FormControlLabel value="disabled" control={<Radio />} label="DFU disabled" />
                      </RadioGroup>
                    </FormControl>
                  ) :    (
                    typeof value === 'boolean' ? value.toString() : value
                  )}
        </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>

        </Table>
      </TableContainer>
      )}
    </div>
  );
}

export default App;
