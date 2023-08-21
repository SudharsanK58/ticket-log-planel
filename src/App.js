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
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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
  const [bleIbeaconModeValue, setBleIbeaconModeValue] = useState(false);
  const [bleConnectModeValue, setBleConnectModeValue] = useState(false);
  const [totalDeviceLogValue, setTotalDeviceLogValue] = useState(false);
  const [sendOnlyGpsLogValue, setSendOnlyGpsLogValue] = useState(false);
  const [buzzerEnableValue, setBuzzerEnableValue] = useState(false);
  const [enableMultipleLightsValue, setEnableMultipleLightsValue] = useState(false);
  const [bleName, setBleName] = useState('');
  const [deviceTopic, setDeviceTopic] = useState('');
  const [deviceReactTopic, setDeviceReactTopic] = useState('');
  const [deviceLogTopic, setDeviceLogTopic] = useState('');
  const [mqttLogDelay, setMqttLogDelay] = useState('');
  const [wifiLogPublishInterval, setWifiLogPublishInterval] = useState('');
  const [gsmLogPublishInterval, setGsmLogPublishInterval] = useState('');
  const [validTiceketDelay, setValidTiceketDelay] = useState('');
  const [invalidTicketDelay, setInvalidTicketDelay] = useState('');
  const [validSpecialTiceketDelay, setValidSpecialTiceketDelay] = useState('');
  const [multipleTicketDelay, setMultipleTicketDelay] = useState('');
  const [specialTicketType, setSpecialTicketType] = useState('');
  const [bleScanMode, setBleScanMode] = useState('');
  

  const handleUpdateDevice = async () => {
    const reformattedData = {
      ble: {
        bleTxPower: bleTxPowerValue,
        ibeaconMajor: ibeaconMajorValue,
        ibeaconMinor: ibeaconMinorValue,
        bleDfuMode: bleDfuModeValue,
        bleIbeaconMode: bleIbeaconModeValue,
        bleConnectMode: bleConnectModeValue,
        bleScanMode: bleScanMode,
        blename: bleName
      },
      mqtt: {
        mqttLogDelay: mqttLogDelay,
        wifiLogPublishInterval: wifiLogPublishInterval,
        gsmLogPublishInterval: gsmLogPublishInterval,
        totalDeviceLog: totalDeviceLogValue,
        sendOnlyGpsLog: sendOnlyGpsLogValue,
        deviceTopic: deviceTopic,
        deviceReactTopic: deviceReactTopic,
        deviceLogTopic: deviceLogTopic
      },
      validation: {
        validTiceketDelay: validTiceketDelay,
        invalidTicketDelay: invalidTicketDelay,
        validSpecialTiceketDelay: validSpecialTiceketDelay,
        multipleTicketDelay: multipleTicketDelay,
        specialTicketType: specialTicketType,
        buzzerEnable: buzzerEnableValue,
        enableMultipleLights: enableMultipleLightsValue
      }
    };
  
    // 4. Print the reformatted data to the console
    console.log(reformattedData);
    console.log(selectedCardToken);
    try {
      const response = await axios.post(
        `http://mqtt.zusan.in:8081/postDeviceData/${selectedCardToken}`, 
        reformattedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Check the response, maybe you want to do something upon success
      if (response.status === 200) {
        console.log('Data successfully sent to the API');
        fetchData(selectedCardToken);
      }
    } catch (error) {
      console.error('Error sending data to the API:', error);
    }
  }
  




  

  const cards = [
    { name: "LED validator", token: "04:e9:e5:14:90:26" },
    { name: "Display validator", token: "04:e9:e5:14:91:41" },
    { name: "Cannada validator 1", token: "04:e9:e5:15:70:ac" },
    { name: "Cannada validator 2", token: "04:e9:e5:15:70:8b" },
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
          setBleIbeaconModeValue(response.data.ble.bleIbeaconMode);
          setBleConnectModeValue(response.data.ble.bleConnectMode);
          setTotalDeviceLogValue(response.data.mqtt.totalDeviceLog);
          setSendOnlyGpsLogValue(response.data.mqtt.sendOnlyGpsLog);
          setBuzzerEnableValue(response.data.validation.buzzerEnable);
          setEnableMultipleLightsValue(response.data.validation.enableMultipleLights);
          setBleName(response.data.ble.blename);
          setDeviceTopic(response.data.mqtt.deviceTopic);
          setDeviceReactTopic(response.data.mqtt.deviceReactTopic);
          setDeviceLogTopic(response.data.mqtt.deviceLogTopic);
          setMqttLogDelay(response.data.mqtt.mqttLogDelay);
          setWifiLogPublishInterval(response.data.mqtt.wifiLogPublishInterval);
          setGsmLogPublishInterval(response.data.mqtt.gsmLogPublishInterval);
          setValidTiceketDelay(response.data.validation.validTiceketDelay);
          setInvalidTicketDelay(response.data.validation.invalidTicketDelay);
          setValidSpecialTiceketDelay(response.data.validation.validSpecialTiceketDelay);
          setMultipleTicketDelay(response.data.validation.multipleTicketDelay);
          setSpecialTicketType(response.data.validation.specialTicketType);
          setBleScanMode(response.data.ble.bleScanMode);
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
        <Button variant="contained" onClick={handleUpdateDevice}>Update device</Button>
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
                  )  : key === 'bleIbeaconMode' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="bleIbeaconMode-radio-group"
                        value={bleIbeaconModeValue ? "Ibeacon" : "BIBO"}
                        onChange={(event) => {
                          setBleIbeaconModeValue(event.target.value === "Ibeacon");
                          console.log(`The updated bleIbeaconMode is ${event.target.value === "Ibeacon"}`);
                        }}
                      >
                        <FormControlLabel value="Ibeacon" control={<Radio />} label="Ibeacon mode" />
                        <FormControlLabel value="BIBO" control={<Radio />} label="BIBO Mode" />
                      </RadioGroup>
                    </FormControl>
                  ) : key === 'bleConnectMode' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="bleConnectMode-radio-group"
                        value={bleConnectModeValue ? "Not connectable" : "Connectable"}
                        onChange={(event) => {
                          const isNotConnectable = event.target.value === "Not connectable";
                          setBleConnectModeValue(isNotConnectable);
                          console.log(`The updated bleConnectMode is ${isNotConnectable}`);
                        }}
                      >
                        <FormControlLabel value="Not connectable" control={<Radio />} label="Not connectable" />
                        <FormControlLabel value="Connectable" control={<Radio />} label="Connectable" />
                      </RadioGroup>
                    </FormControl>
                  ) : key === 'totalDeviceLog' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="totalDeviceLog-radio-group"
                        value={totalDeviceLogValue ? "Periodic logs" : "One time log"}
                        onChange={(event) => {
                          const isPeriodicLogs = event.target.value === "Periodic logs";
                          setTotalDeviceLogValue(isPeriodicLogs);
                          console.log(`The updated totalDeviceLog is ${isPeriodicLogs}`);
                        }}
                      >
                        <FormControlLabel value="Periodic logs" control={<Radio />} label="Periodic logs" />
                        <FormControlLabel value="One time log" control={<Radio />} label="One time log" />
                      </RadioGroup>
                    </FormControl>
                  ): key === 'sendOnlyGpsLog' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="sendOnlyGpsLog-radio-group"
                        value={sendOnlyGpsLogValue ? "Only GPS log" : "Full device log"}
                        onChange={(event) => {
                          const isOnlyGpsLog = event.target.value === "Only GPS log";
                          setSendOnlyGpsLogValue(isOnlyGpsLog);
                          console.log(`The updated sendOnlyGpsLog is ${isOnlyGpsLog}`);
                        }}
                      >
                        <FormControlLabel value="Only GPS log" control={<Radio />} label="Only GPS log" />
                        <FormControlLabel value="Full device log" control={<Radio />} label="Full device log" />
                      </RadioGroup>
                    </FormControl>
                  ): key === 'buzzerEnable' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="buzzerEnable-radio-group"
                        value={buzzerEnableValue ? "Sound mode" : "Silent mode"}
                        onChange={(event) => {
                          const isSoundMode = event.target.value === "Sound mode";
                          setBuzzerEnableValue(isSoundMode);
                          console.log(`The updated buzzerEnable mode is ${isSoundMode ? 'Sound mode' : 'Silent mode'}`);
                        }}
                      >
                        <FormControlLabel value="Sound mode" control={<Radio />} label="Sound mode" />
                        <FormControlLabel value="Silent mode" control={<Radio />} label="Silent mode" />
                      </RadioGroup>
                    </FormControl>
                  ) : key === 'enableMultipleLights' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="enableMultipleLights-radio-group"
                        value={enableMultipleLightsValue ? "Group tickets validation" : "Single ticket validation"}
                        onChange={(event) => {
                          const isGroupTicket = event.target.value === "Group tickets validation";
                          setEnableMultipleLightsValue(isGroupTicket);
                          console.log(`The updated enableMultipleLights mode is ${isGroupTicket ? 'Group tickets validation' : 'Single ticket validation'}`);
                        }}
                      >
                        <FormControlLabel value="Group tickets validation" control={<Radio />} label="Group tickets validation" />
                        <FormControlLabel value="Single ticket validation" control={<Radio />} label="Single ticket validation" />
                      </RadioGroup>
                    </FormControl>
                  ) : key === 'blename' ? (
                    <div>
                      <TextField
                        id="ble-name-textfield"
                        label="BLE Name"
                        multiline
                        rows={1}
                        value={bleName}
                        inputProps={{ maxLength: 12 }}
                        onChange={(e) => {
                          setBleName(e.target.value);
                          console.log(`The updated BLE name is: ${e.target.value}`);
                        }}
                        variant="standard"
                      />
                    </div>
                  ) : key === 'deviceTopic' ? (
                    <div>
                      <TextField style={{width:"40%"}}
                        id="device-topic-textfield"
                        label="Device Topic"
                        multiline
                        rows={1}
                        value={deviceTopic}
                        onChange={(e) => {
                          setDeviceTopic(e.target.value);
                          console.log(`The updated device topic is: ${e.target.value}`);
                        }}
                        variant="standard"
                      />
                    </div>
                  ) : key === 'deviceReactTopic' ? (
                    <div>
                      <TextField style={{width:"40%"}}
                        id="device-react-topic-textfield"
                        label="Device React Topic"
                        multiline
                        rows={1}
                        value={deviceReactTopic}
                        onChange={(e) => {
                          setDeviceReactTopic(e.target.value);
                          console.log(`The updated device react topic is: ${e.target.value}`);
                        }}
                        variant="standard"
                      />
                    </div>
                  )
                  : key === 'deviceLogTopic' ? (
                    <div>
                      <TextField style={{width:"40%"}}
                        id="device-log-topic-textfield"
                        label="Device Log Topic"
                        multiline
                        rows={1}
                        value={deviceLogTopic}
                        onChange={(e) => {
                          setDeviceLogTopic(e.target.value);
                          console.log(`The updated device log topic is: ${e.target.value}`);
                        }}
                        variant="standard"
                      />
                    </div>
                  ) : key === 'bleScanMode' ? (
                    <FormControl>
                      <RadioGroup
                        row
                        name="bleScanModeEnable-radio-group"
                        value={bleScanMode ? "Ibeacon scan mode" : "No scan mode"}
                        onChange={(event) => {
                          const isScanMode = event.target.value === "Ibeacon scan mode";
                          setBleScanMode(isScanMode);
                          console.log(`The updated belScanMode mode is ${isScanMode}`);
                        }}
                      >
                        <FormControlLabel value="Ibeacon scan mode" control={<Radio /> } label="Ibeacon scan mode" />
                        <FormControlLabel value="No scan mode" control={<Radio />} label="No scan mode" />
                      </RadioGroup>
                    </FormControl>
                  ) : (
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
