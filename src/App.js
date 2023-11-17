
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import { Alert, AlertTitle } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WifiIcon from '@mui/icons-material/Wifi';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import CellTowerIcon from '@mui/icons-material/CellTower';

function App() {
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);   
  const [ticketId, setTicketId] = useState('');
  const [selectedButton, setSelectedButton] = useState('Ticket List'); // Initialize with the default selected button
  const [scratchTicketLoading, setScratchTicketLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [androidOrIOS, setAndroidOrIOS] = useState('Android'); // State for Android or iOS select
  const [validator, setValidator] = useState('Ecolane'); // State for the Validator select
  const [apiResponse, setApiResponse] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('IST'); // Initialize with a default value if needed
  const [deviceStatusLoading, setDeviceStatusLoading] = useState(false);
  const [deviceStatusData, setDeviceStatusData] = useState(null);
  const [searchDeviceIdMode, setSearchDeviceIdMode] = useState('');
  const [searchedDeviceId, setSearchedDeviceId] = useState('');
  const [isSearchingDeviceId, setIsSearchingDeviceId] = useState(false);
  const [searchDeviceIdResponse, setSearchDeviceIdResponse] = useState(null);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [ticketlistSelectedTimeZone, ticketlistsetSelectedTimeZone] = useState('IST'); // Define ticketlistSelectedTimeZone and ticketlistsetSelectedTimeZone
  const [ticketlistSelectedTimeFormat, ticketlistsetSelectedTimeFormat] = useState('12hr'); // Updated state variable
  const [validatorSettingsSelectedButton, setValidatorSettingsSelectedButton] = useState('');
  const [validatorSettingsSearchedDeviceId, setValidatorSettingsSearchedDeviceId] = useState('');
  const [validatorSettingsApiResponse, setValidatorSettingsApiResponse] = useState(null);
  const [validatorSettingsApiLoading, setValidatorSettingsApiLoading] = useState(false);
  const [deviceConfigDataArray, setDeviceConfigDataArray] = useState([]);
  const [validatorSettingSelectedDeviceId, setValidatorSettingSelectedDeviceId] = useState(null);
  const [validatorSettingConfirmationCode, setValidatorSettingConfirmationCode] = useState('');

  const validatorSettingWifiButtonClick  = async (deviceId) => {
    try {
      // Make the API call to get device configuration
      const response = await fetch(`https://mdot.zed-admin.com/api/GetDeviceConfig/${deviceId}`);
      
      // Check if the response is successful
      if (response.ok) {
        const validatorSettingDeviceConfig = await response.json();
        // Extract SSID and password
        const extractedSsid = validatorSettingDeviceConfig.wifi.primaryWifi.ssid;
        const extractedPassword = validatorSettingDeviceConfig.wifi.primaryWifi.password;

        // Prompt the user for editing SSID and password
        const editedSsid = window.prompt('Edit SSID:', extractedSsid);
        const editedPassword = window.prompt('Edit Password:', extractedPassword);

        // Check if the user clicked "Cancel" in the prompt
        if (editedSsid === null || editedPassword === null) {
          return;
        }
        setValidatorSettingsApiLoading(true);
        // Make the API call to update device configuration
        const updateResponse = await fetch('https://mdot.zed-admin.com/api/UpdateDeviceConfig', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId: deviceId,
            ssid1: editedSsid,
            password1: editedPassword,
            blename: validatorSettingDeviceConfig.ble.blename,
            bleTxPower: validatorSettingDeviceConfig.ble.bleTxPower,
            bleDfuMode: validatorSettingDeviceConfig.ble.bleDfuMode,
            ibeaconMajor: validatorSettingDeviceConfig.ble.ibeaconMajor,
            ibeaconMinor: validatorSettingDeviceConfig.ble.ibeaconMinor,
            bleIbeaconMode: validatorSettingDeviceConfig.ble.bleIbeaconMode,
            bleConnectMode: validatorSettingDeviceConfig.ble.bleConnectMode,
            deviceTopic: validatorSettingDeviceConfig.mqtt.deviceTopic,
            deviceReactTopic: validatorSettingDeviceConfig.mqtt.deviceReactTopic,
            deviceLogTopic: validatorSettingDeviceConfig.mqtt.deviceLogTopic,
            validTiceketDelay: validatorSettingDeviceConfig.validation.validTiceketDelay,
            invalidTicketDelay: validatorSettingDeviceConfig.validation.invalidTicketDelay,
            mqttLogDelay: validatorSettingDeviceConfig.mqtt.mqttLogDelay,
            validSpecialTiceketDelay: validatorSettingDeviceConfig.validation.validSpecialTiceketDelay,
            wifiLogPublishInterval: validatorSettingDeviceConfig.mqtt.wifiLogPublishInterval,
            gsmLogPublishInterval: validatorSettingDeviceConfig.mqtt.gsmLogPublishInterval,
            sendOnlyGpsLog: validatorSettingDeviceConfig.mqtt.sendOnlyGpsLog,
            totalDeviceLog: validatorSettingDeviceConfig.mqtt.totalDeviceLog,
            multipleTicketDelay: validatorSettingDeviceConfig.validation.multipleTicketDelay,
            specialTicketType: validatorSettingDeviceConfig.validation.specialTicketType,
            buzzerEnable: validatorSettingDeviceConfig.validation.buzzerEnable,
            enableMultipleLights: validatorSettingDeviceConfig.validation.enableMultipleLights,
            ssid2: validatorSettingDeviceConfig.wifi.secondaryWifi.ssid,
            password2: validatorSettingDeviceConfig.wifi.secondaryWifi.password,
            firmwareVersion: validatorSettingDeviceConfig.firmware.firmwareVersion,
            firmwareUrl: validatorSettingDeviceConfig.firmware.firmwareUrl,
            deviceTicketTelematricHybridMode: validatorSettingDeviceConfig.gps.deviceTicketTelematricHybridMode,
            requiredNosatellites: validatorSettingDeviceConfig.gps.requiredNosatellites,
            requiredSpeedLimit: validatorSettingDeviceConfig.gps.requiredSpeedLimit,
            startDeviceMode: validatorSettingDeviceConfig.validation.startDeviceMode,
            displayLastTicketScreen: validatorSettingDeviceConfig.validation.displayLastTicketScreen,
            enableToggleDisplayLines: validatorSettingDeviceConfig.validation.enableToggleDisplayLines,
            homepageHeadingStatus1: validatorSettingDeviceConfig.validation.homepageHeadingStatus1,
            homepageHeadingStatus2: validatorSettingDeviceConfig.validation.homepageHeadingStatus2,
            homepageHeadingStatus3: validatorSettingDeviceConfig.validation.homepageHeadingStatus3,
            homepageHeadingStatus4: validatorSettingDeviceConfig.validation.homepageHeadingStatus4,
            storeTicketDataList: validatorSettingDeviceConfig.validation.storeTicketDataList,
            storeTicketDataListCout: validatorSettingDeviceConfig.validation.storeTicketDataListCout,
            sendOutCardData : validatorSettingDeviceConfig.gps.sendOutCardData,
            sendOutCardDataCount: validatorSettingDeviceConfig.gps.sendOutCardDataCount,
            bleCardTopic: validatorSettingDeviceConfig.mqtt.bleCardTopic,
            bleScanMode: validatorSettingDeviceConfig.ble.bleScanMode,
            bleCardScanRssi: validatorSettingDeviceConfig.ble.bleCardScanRssi
          }),
        });

        if (updateResponse.ok) {
          // Handle successful update
          console.log('Device configuration updated successfully!');
          validatorSettingsCallApi();
          alert('Wifi creds changed successfully.');
        } else {
          console.error('Error updating device configuration:', updateResponse.statusText);
          alert('Error updating device configuration:', updateResponse.statusText);
        }
      } else {
        console.error('Error fetching device configuration:', response.statusText);
        alert('Error fetching device configuration:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching/updating device configuration:', error.message);
      alert('Error fetching/updating device configuration:', error.message);
    }
  };

  const vaildatorSettingAddDevice = () => {
    const enteredCode = window.prompt('Please enter the confirmation code:');
    if (enteredCode === '1223') {
    const enteredDeviceId = window.prompt('Enter Device ID:');
    const enteredIbeaconMinor = window.prompt('Enter iBeacon Minor:');

    if (enteredDeviceId && enteredIbeaconMinor) {
      setValidatorSettingsApiLoading(true);
      // Make the API call with the entered values
      fetch('https://mdot.zed-admin.com/api/AddDeviceConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: enteredDeviceId,
          blename: "BIBO 1.1 A",
          bleTxPower: 4,
          bleDfuMode: false,
          ibeaconMajor: 100,
          ibeaconMinor: parseInt(enteredIbeaconMinor, 10),
          bleIbeaconMode: true,
          bleConnectMode: true,
          deviceTopic: `${enteredDeviceId}/device`,
          deviceReactTopic: `${enteredDeviceId}/react`,
          deviceLogTopic: `${enteredDeviceId}/log`,
          validTiceketDelay: 1500,
          invalidTicketDelay: 300,
          mqttLogDelay: 10000,
          validSpecialTiceketDelay: 10000,
          wifiLogPublishInterval: 10000,
          gsmLogPublishInterval: 20000,
          sendOnlyGpsLog: true,
          totalDeviceLog: true,
          multipleTicketDelay: 1000,
          specialTicketType: 1,
          buzzerEnable: true,
          enableMultipleLights: false,
          ssid1: "Zed_34",
          password1: "Wireless4U",
          ssid2: "your_ssid_2",
          password2: "your_password_2",
          firmwareVersion: "your_firmware_version",
          firmwareUrl: "your_firmware_url",
          deviceTicketTelematricHybridMode: 2,
          requiredNosatellites: 4,
          requiredSpeedLimit: 5.0,
          startDeviceMode: 1,
          displayLastTicketScreen: true,
          enableToggleDisplayLines: true,
          homepageHeadingStatus1: "READY ",
          homepageHeadingStatus2: "WAIT",
          homepageHeadingStatus3: "OFFLINE",
          homepageHeadingStatus4: "CARD VALIDATED",
          storeTicketDataList: false,
          storeTicketDataListCout: 2,
          sendOutCardData : false,
          sendOutCardDataCount: 5,
          bleCardTopic: `${enteredDeviceId}/cards`,
          bleScanMode: false,
          bleCardScanRssi: -55
        }),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the API response as needed
          console.log(data);
          validatorSettingsCallApi();
          alert('Device added successfully.');
        })
        .catch(error => {
          // Handle errors
          console.error('Error adding device:', error);
          validatorSettingsCallApi();
          alert('Error adding device:', error);
        });
    }
    }else {
      // Notify the user that the code is incorrect
      alert('Incorrect confirmation code.');
    }
    
  };

  const handleValidatorSettingDelete = async (deviceId) => {
    // Prompt the user for a confirmation code
    const enteredCode = window.prompt('Please enter the confirmation code:');

    // Check if the entered code matches the expected code
    if (enteredCode === '1223') {
      const confirmation = window.confirm(`Are you sure you want to delete the device with ID: ${deviceId}?`);

      if (confirmation) {
        try {
          // Set loading to true while making the API call
          setValidatorSettingsApiLoading(true);

          // Make the API call to delete the device
          const response = await fetch(`https://mdot.zed-admin.com/api/DeleteDeviceConfig/${deviceId}`, {
            method: 'DELETE', // or 'POST' based on your API
            // Add headers if needed
          });

          // Check if the response is successful
          if (response.ok) {
            const result = await response.json();
            // Handle the API response as needed
            console.log(result.message); // Log the message or take other actions
          } else {
            // Handle errors if the response is not successful
            console.error('Error deleting device:', response.statusText);
            setValidatorSettingsApiLoading(false);
          }
        } catch (error) {
          // Handle any network or other errors
          console.error('Error deleting device:', error.message);
          setValidatorSettingsApiLoading(false);
        } finally {
          // Set loading back to false after the API call completes
          // Call the function at the end
          validatorSettingsCallApi();
        }
      }
    } else {
      // Notify the user that the code is incorrect
      alert('Incorrect confirmation code. Deletion canceled.');
    }
  };

  
  const redBackgroundRowStyle = {
    backgroundColor: 'lightcoral',
  };
  const transitionStyle = {
    transition: 'opacity 0.5s ease-in-out',
  };
  function isLastSeenBelow5Minutes(inTime) {
    const currentTime = new Date();
    const inTimeUTC = new Date(new Date(inTime).getTime() + (5 * 60 + 30) * 60 * 1000);
  
    const timeDifferenceInSeconds = Math.floor((currentTime - inTimeUTC) / 1000);
  
    return timeDifferenceInSeconds < 300; // 300 seconds = 5 minutes
  }
  
  function calculateTimeDifference(inTime) {
    const currentTime = new Date();
    const inTimeUTC = new Date(new Date(inTime).getTime() + (5 * 60 + 30) * 60 * 1000);
  
    const timeDifferenceInSeconds = Math.floor((currentTime - inTimeUTC) / 1000);
  
    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} secs`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} mins`;
    } else {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hrs`;
    }
  }
  
  const validatorSettingsCallApi = () => {
    setValidatorSettingsApiLoading(true);
  
    fetch('https://mdot.zed-admin.com/api/GetAvailableDevices')
      .then((validatorSettingsResponse) => validatorSettingsResponse.json())
      .then((validatorSettingsData) => {
        console.log('Validator Settings API Response:', validatorSettingsData);
        setValidatorSettingsApiResponse(validatorSettingsData);
  
        // Create an array of promises for fetching device configs
        const deviceConfigPromises = validatorSettingsData.deviceId.map((deviceId) => {
          const deviceConfigApiUrl = `https://mdot.zed-admin.com/api/GetDeviceConfig/${deviceId}`;
          return fetch(deviceConfigApiUrl)
            .then((validatorSettingsDeviceConfigResponse) => validatorSettingsDeviceConfigResponse.json())
            .catch((error) => {
              console.error(`Error fetching device config for ${deviceId}:`, error);
              return null;
            });
        });
  
        // Wait for all promises to resolve
        Promise.all(deviceConfigPromises)
          .then((deviceConfigDataArray) => {
            setValidatorSettingsApiLoading(false);
            console.log('All device config data received:', deviceConfigDataArray);
            setDeviceConfigDataArray(deviceConfigDataArray);
          });
      })
      .catch((error) => {
        console.error('Validator Settings API Error:', error);
        setValidatorSettingsApiLoading(false);
      });
  };
  
  
  const handleButtonClick = (buttonText) => {
    if (selectedButton !== buttonText) {
      setSelectedButton(buttonText);
      if (buttonText === 'Search Ticket') {
        // Clear the Search Ticket table when the button is selected
        setTickets([]);
      }
      if (buttonText === 'Validator Registered'){
        handleGetDetailsClick()
      }
      
    }
  };
  const cards = [
    { name: "24-Office-Device", token: "98:CD:AC:51:4A:BC" },
    { name: "51-Office-Device", token: "98:CD:AC:A0:01:51" },
    { name: "48-BJCT-Device", token: "98:CD:AC:A0:01:48" },
    { name: "49-BJCT-Device", token: "98:CD:AC:A0:01:49" },
    { name: "70-US/CAN-Device", token: "04:E9:E5:15:70:AC" },
    { name: "75-US/CAN-Device", token: "04:E9:E5:15:70:8B" },
    { name: "201-Office-Device", token: "04:e9:e5:15:70:91" },
    { name: "202-Office-Device", token: "04:e9:e5:14:90:26" },
    { name: "203-Office-Device", token: "04:e9:e5:15:6f:f1" }
  ];
  const [selectedCardToken, setSelectedCardToken] = useState(cards[0].token); 

    // Function to make the API call for device status
    const fetchDeviceStatusData = () => {
      // Check if the "Validator Status" button is selected
      if (selectedButton === 'Validator Status') {
        setDeviceStatusLoading(true);
  
        // Construct the API URL based on the selected timezone
        const apiUrl = `http://mqtt.zusan.in:8080/device_log_data`;
  
        // Make the API request
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            setDeviceStatusData(data);
            setDeviceStatusLoading(false);
            // Log the apiResponse and loading status
            console.log('API Response:', data);
            console.log('Loading Status:', deviceStatusLoading);
            console.log(`User's time zone: ${userTimeZone}`);
          })
          .catch((error) => {
            console.error('Error fetching device status data:', error);
            setDeviceStatusLoading(false);
          });
      }
    };
    const searchDeviceId = () => {
      if (searchedDeviceId) {
        // Make the API request using the entered device ID
        setIsSearchingDeviceId(true);
        fetch(`https://mdot.zed-admin.com/api/GetDeviceConfig/${searchedDeviceId}`)
          .then((response) => response.json())
          .then((data) => {
            setIsSearchingDeviceId(false);
            // Handle the API response, e.g., print it to the console
            console.log(data);
            setSearchDeviceIdResponse(data);
          })
          .catch((error) => {
            console.error('API request error:', error);
            setIsSearchingDeviceId(false);
          });
      }
    };
  const fetchData = (token) => {
    setLoading(true);
  
    axios.get(`http://mqtt.zusan.in:8080/today_data_device_id/${token}`)
      .then(response => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
        setLoading(false);
      });
  };
  const fetchTicketData = () => {
    if (!/^\d+$/.test(ticketId)) {
      // Input is not a valid number
      return;
    }
    setScratchTicketLoading(true);
    setTickets([]);

    axios.get(`http://mqtt.zusan.in:8080/today_data_ticket_id/${ticketId}`)
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTickets(response.data);
          setScratchTicketLoading(false);
          setNoDataFound(false);
        } else {
          setTickets([]);
          setScratchTicketLoading(false);
          // alert('No valid response found.');
          setNoDataFound(true);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
        setScratchTicketLoading(false);
        setTickets([]);
      });
  };
  useEffect(() => {
    fetchData(selectedCardToken);
  }, []);
    

  const ticketlistFormatTime = (timeString) => {
    // Split the date and time parts
    const [datePart, timePart, timeZone] = timeString.split(' ');
  
    // Parse the date and time parts
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
  
    // Create a new Date object with the parsed values
    const date = new Date(year, month - 1, day, hour, minute, second);
  
    // Handle timezone differences
  if (ticketlistSelectedTimeZone === 'EST') {
    // IST is 9 hours and 30 minutes ahead of EST
    date.setHours(date.getHours() - 9);
    date.setMinutes(date.getMinutes() - 30);
  } else if (ticketlistSelectedTimeZone === 'PST') {
    // IST is 12 hours and 30 minutes ahead of PST
    date.setHours(date.getHours() - 12);
    date.setMinutes(date.getMinutes() - 30);
  } else if (ticketlistSelectedTimeZone === 'CST') {
    // IST is 10 hours and 30 minutes ahead of CST
    date.setHours(date.getHours() - 10);
    date.setMinutes(date.getMinutes() - 30);
  } else if (ticketlistSelectedTimeZone === 'MST') {
    // IST is 11 hours and 30 minutes ahead of MST
    date.setHours(date.getHours() - 11);
    date.setMinutes(date.getMinutes() - 30);
  }
  
    // Check if the date has gone to the previous day
    if (date.getDate() !== parseInt(day, 10)) {
      date.setDate(date.getDate() - 1); // Increment the date by one day
    }
  
    // Format the date and time based on the selected time format
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour12: ticketlistSelectedTimeFormat === '12hr',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    const formattedTime = date.toLocaleString('en-US', options);

  if (ticketlistSelectedTimeFormat === '24hr') {
    return formattedTime + ' hrs';
  }

  return formattedTime;
  };
  
  const ticketlistFormatTimeUTC = (timeString) => {
    // Parse the UTC time string
    const date = new Date(timeString);

    

    if (ticketlistSelectedTimeZone === 'EST') {
        date.setHours(date.getHours() - 4);
        date.setMinutes(date.getMinutes());
    } else if (ticketlistSelectedTimeZone === 'PST') {
        date.setHours(date.getHours() - 7);
        date.setMinutes(date.getMinutes());
    } else if (ticketlistSelectedTimeZone === 'CST') {
        date.setHours(date.getHours() - 5);
        date.setMinutes(date.getMinutes());
    } else if (ticketlistSelectedTimeZone === 'MST') {
        date.setHours(date.getHours() - 6);
        date.setMinutes(date.getMinutes());
    }else if (ticketlistSelectedTimeZone === 'IST') {
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);
  }

    // Check if the date has gone to the previous day
    const day = date.getUTCDate();
    if (day !== date.getUTCDate()) {
        date.setUTCDate(day - 1);
    }

    // Format the date and time based on the selected time format
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour12: ticketlistSelectedTimeFormat === '12hr',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const formattedTime = date.toLocaleString('en-US', options);

    if (ticketlistSelectedTimeFormat === '24hr') {
        return formattedTime;
    }

    return formattedTime;
};
  

  
  
  

  const handleGetDetailsClick = () => {
    let apiUrl = '';
    setLoading(true); // Set loading state
    if (androidOrIOS === 'Android' && validator === 'Ecolane') {
      apiUrl = 'https://zig-app.com/ConfigAPIV2/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'IOS' && validator === 'Ecolane') {
      apiUrl = 'https://zig-app.com/ConfigAPIV2IOS/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'Android' && validator === 'MODOT') {
      apiUrl = 'https://zig-trip.com/ConfigAPIV2/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'IOS' && validator === 'MODOT') {
      apiUrl = 'https://zig-trip.com/ConfigAPIV2IOS/Getclientconfig?Pin=ZIG19';
    }else if (androidOrIOS === 'Android' && validator === 'ZIG') {
      apiUrl = 'https://zig-web.com/configapiv2/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'IOS' && validator === 'ZIG') {
      apiUrl = 'https://zig-web.com/configapiv2ios/Getclientconfig?Pin=ZIG19';
    }
    

    if (apiUrl) {
      axios.get(apiUrl)
        .then(response => {
          console.log("API Response:", response.data);
          setApiResponse(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the data:", error);
          setApiResponse('');
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    if (selectedButton === 'Ticket List') {
      // When switching back to "Ticket List" button, load data
      fetchData(selectedCardToken);
    }
    if (selectedButton === 'Validator Status') {
      // When switching back to "Ticket List" button, load data
      fetchDeviceStatusData()
    }
    if (selectedButton === 'Validator Settings') {
      // When switching back to "Ticket List" button, load data
      validatorSettingsCallApi()
    }
  }, [selectedButton, selectedCardToken]);
  

  return (
    <div className="App">
    <Typography variant="h4" gutterBottom align="center" marginTop="2%">
      Device log panel
    </Typography>

    {/* Center-align the ButtonGroup */}
    <div style={{ textAlign: 'center' , marginTop: "2%" }}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          onClick={() => handleButtonClick('Ticket List')}
          variant={selectedButton === 'Ticket List' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Ticket List' ? 'bold' : 'normal' }}
        >
          Ticket List
        </Button>
        <Button
          onClick={() => handleButtonClick('Search Ticket')}
          variant={selectedButton === 'Search Ticket' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Search Ticket' ? 'bold' : 'normal' }}
        >
          Search Ticket
        </Button>
        <Button
          onClick={() => handleButtonClick('Validator Registered')}
          variant={selectedButton === 'Validator Registered' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Validator Registered' ? 'bold' : 'normal' }}
        >
          Validator Registered
        </Button>
        <Button
          onClick={() => handleButtonClick('Validator Status')}
          variant={selectedButton === 'Validator Status' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Validator Status' ? 'bold' : 'normal' }}
        >
          Validator Status
        </Button>
        <Button
          onClick={() => handleButtonClick('Validator Settings')}
          variant={selectedButton === 'Validator Settings' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Validator Settings' ? 'bold' : 'normal' }}
        >
          Validator Settings
        </Button>
      </ButtonGroup>
    </div>

    {/* Conditional rendering of Stack and Table */}
    {selectedButton === 'Ticket List' && (
      <>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
          <FormControl variant="outlined" size="small">
            <Select
              value={selectedCardToken}
              onChange={(e) => {
                setSelectedCardToken(e.target.value);
                fetchData(e.target.value); // This line ensures proper fetching when a new card is selected
              }}
              style={{ marginRight: '10px', width: '200px' }}
            >
              {cards.map(card => (
                <MenuItem key={card.token} value={card.token}>{card.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => fetchData(selectedCardToken)}>
            <ReplayIcon />
          </Button>
          <FormControl variant="outlined" size="small">
          <Select
            labelId="timezone-label"
            value={ticketlistSelectedTimeZone}
            onChange={(e) => {
              ticketlistsetSelectedTimeZone(e.target.value);
              // Handle timezone change here
            }}
            style={{ marginLeft: '10px', width: '100px' }}
          >
            <MenuItem value="IST">IST</MenuItem>
            <MenuItem value="EST">EST</MenuItem>
            <MenuItem value="PST">PST</MenuItem>
            <MenuItem value="CST">CST</MenuItem>
            <MenuItem value="MST">MST</MenuItem>
          </Select>

        </FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          style={{ marginLeft: '30px', width: '190px' }}
          value={ticketlistSelectedTimeFormat}
          onChange={(e) => {
            ticketlistsetSelectedTimeFormat(e.target.value);
          }}
        >
          <FormControlLabel value="12hr" control={<Radio />} label="12 hrs" />
          <FormControlLabel value="24hr" control={<Radio />} label="24 hrs" />
        </RadioGroup>
        </Stack>
        {/* Table Component */}
        <div style={{ marginTop: '20px' }}>
          {loading ? (
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
              <CircularProgress style={{ marginTop: '20px' }} />
            </Stack>
          ) : tickets.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              No tickets ticket is validated on this device.
            </Alert>
          ) : (
            <TableContainer style={{ marginTop: '20px', overflow: "auto", justifyContent: 'center', alignItems: 'center' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>User Name</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Ticket ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Count</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Validated time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket, index) => (
                    <TableRow
                      key={ticket.ticket_id}
                      style={index > 0 && ticket.ticket_id === tickets[index - 1].ticket_id ? redBackgroundRowStyle : {}}
                    >
                      <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.username}</TableCell>
                      <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.ticket_id}</TableCell>
                      <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.count}</TableCell>
                      <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                        {ticketlistFormatTime(ticket.now_time)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </>
    )}
    {selectedButton === 'Search Ticket' && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
            <TextField
              label="Ticket ID"
              variant="outlined"
              size="small"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              style={{ width: '200px' }} // Adjust width as needed
              inputProps={{ pattern: '[0-9]*' }} // Only allow numeric input
            />
            <Button variant="contained" onClick={fetchTicketData}>
              <SearchIcon />
            </Button>
            <FormControl variant="outlined" size="small">
          <Select
            labelId="timezone-label"
            value={ticketlistSelectedTimeZone}
            onChange={(e) => {
              ticketlistsetSelectedTimeZone(e.target.value);
              // Handle timezone change here
            }}
            style={{ marginLeft: '10px', width: '100px' }}
          >
            <MenuItem value="IST">IST</MenuItem>
            <MenuItem value="EST">EST</MenuItem>
            <MenuItem value="PST">PST</MenuItem>
            <MenuItem value="CST">CST</MenuItem>
            <MenuItem value="MST">MST</MenuItem>
          </Select>

        </FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          style={{ marginLeft: '30px', width: '190px' }}
          value={ticketlistSelectedTimeFormat}
          onChange={(e) => {
            ticketlistsetSelectedTimeFormat(e.target.value);
          }}
        >
          <FormControlLabel value="12hr" control={<Radio />} label="12 hrs" />
          <FormControlLabel value="24hr" control={<Radio />} label="24 hrs" />
        </RadioGroup>
          </Stack>
        )}
         {scratchTicketLoading && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <CircularProgress style={{ marginTop: '20px' }} />
        </div>
      )}
      {noDataFound && selectedButton === 'Search Ticket' && !scratchTicketLoading && (
        <Alert severity="info" style={{ marginTop: '20px' }}>
          <AlertTitle>Info</AlertTitle>
          No data found for this ticket id
        </Alert>
      )}
        {tickets.length > 0 && selectedButton === 'Search Ticket' && (
        <TableContainer style={{ marginTop: '20px', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>User Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Ticket Type</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Ticket ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Device ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Validated Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket, index) => (
                <TableRow
                  key={ticket.ticket_id}
                  style={index > 0 && ticket.ticket_id === tickets[index - 1].ticket_id ? redBackgroundRowStyle : {}}
                >
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.username}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.ticket_type}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.ticket_id}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.device_id}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                      {ticketlistFormatTime(ticket.now_time)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
  {selectedButton === 'Validator Registered' && (
          <>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
              <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
                <Select
                  value={androidOrIOS}
                  onChange={(e) => setAndroidOrIOS(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <MenuItem value="Android">Android</MenuItem>
                  <MenuItem value="IOS">IOS</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
                <Select
                  value={validator}
                  onChange={(e) => setValidator(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <MenuItem value="Ecolane">Ecolane</MenuItem>
                  <MenuItem value="MODOT">MODOT</MenuItem>
                  <MenuItem value="ZIG">ZIG</MenuItem> 
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleGetDetailsClick}>
                Get Details
              </Button>
            </Stack>

            {loading && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <CircularProgress style={{ marginTop: '20px' }} />
              </div>
            )}

{!loading && apiResponse && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
<TableContainer style={{ marginTop: '20px', overflow: "auto", justifyContent: 'center', alignItems: 'center' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '300px', textAlign: 'center' }}>Macaddress</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '300px', textAlign: 'center' }}>Major</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '300px', textAlign: 'center' }}>Minor</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '700px', textAlign: 'center' }}>Client Names</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {!loading && apiResponse && (
        apiResponse.reduce((uniqueDevices, client) => {
          client.Macaddresslist.forEach(macAddressItem => {
            const existingDevice = uniqueDevices.find(
              device => device.Macaddress === macAddressItem.Macaddress
            );
            if (existingDevice) {
              const clientId = { Id: client.Id, ClientName: client.Clientname };
              // Use a Set to ensure unique client names
              const uniqueClientNames = new Set(existingDevice.ClientNames.map(item => item.ClientName));
              if (!uniqueClientNames.has(client.Clientname)) {
                existingDevice.ClientNames.push(clientId);
              }
            } else {
              uniqueDevices.push({
                Macaddress: macAddressItem.Macaddress,
                Major: macAddressItem.Major,
                Minor: macAddressItem.Minor,
                ClientNames: [{ Id: client.Id, ClientName: client.Clientname }],
              });
            }
          });
          return uniqueDevices;
        }, []).map(device => (
          <TableRow key={device.Macaddress}>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.Macaddress}</TableCell>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.Major}</TableCell>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.Minor}</TableCell>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
            {device.ClientNames.map((client, index) => (
              <span key={index}>
                {client.Id}: {client.ClientName}
                {index < device.ClientNames.length - 1 && ', '}
              </span>
            ))}
          </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>
  </div>
)}
          </>
        )}
  {selectedButton === 'Validator Status' && (
  <>
    {/* Dropdown for Timezone selection */}
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
    <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
    <Select
      labelId="timezone-label"
      value={ticketlistSelectedTimeZone}
      onChange={(e) => {
        ticketlistsetSelectedTimeZone(e.target.value);
        // Handle timezone change here
      }}
      style={{ marginLeft: '10px', width: '100px' }}
    >
      <MenuItem value="IST">IST</MenuItem>
      <MenuItem value="EST">EST</MenuItem>
      <MenuItem value="PST">PST</MenuItem>
      <MenuItem value="CST">CST</MenuItem>
      <MenuItem value="MST">MST</MenuItem>
    </Select>
    </FormControl>
    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="row-radio-buttons-group"
      style={{ marginLeft: '30px', width: '190px' }}
      value={ticketlistSelectedTimeFormat}
      onChange={(e) => {
        ticketlistsetSelectedTimeFormat(e.target.value);
      }}
    >
      <FormControlLabel value="12hr" control={<Radio />} label="12 hrs" />
      <FormControlLabel value="24hr" control={<Radio />} label="24 hrs" />
    </RadioGroup>
    {/* Reload button */}
    <Button variant="contained" onClick = {fetchDeviceStatusData}>
      Reload
    </Button>
    </Stack>
    
    {/* Rest of the code related to loading and displaying data */}
      {deviceStatusLoading && (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <CircularProgress style={{ marginTop: '20px' }} />
    </div>
  )}

  {!deviceStatusLoading && deviceStatusData && (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <TableContainer style={{ marginTop: '20px', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Device ID</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Network</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Ble power</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Ble minor</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Last seen(IST)</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Start time</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Last in time</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Running status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {!deviceStatusLoading &&
        deviceStatusData &&
        deviceStatusData.map((item, index) => {
          // Parse the "Starting Time" and "Last In Time" as Date objects
          const startingTime = new Date(item.StartingTime);
          const lastInTime = new Date(item.timestamp);

          // Calculate the time difference in milliseconds
          const timeDifference = lastInTime - startingTime;

          // Convert milliseconds to hours, minutes, and seconds
          const hours = Math.floor(timeDifference / (60 * 60 * 1000));
          const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

          return (
            <TableRow key={index}>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.deviceId}</TableCell>
              {item.networkConnection === 2 ? (
                <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                  <Chip
                    icon={<WifiIcon />}
                    label={item.networkName}
                    color="primary"
                  />
                </TableCell>
              ) : item.networkConnection === 1 ? (
                <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                  <Chip
                    icon={<CellTowerIcon />}
                    label={item.networkName}
                    color="secondary"  
                  />
                </TableCell>
              ) : (
                <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.networkConnection}</TableCell>
              )}
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.bleTxpower}</TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.bleMinor}</TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center', color: isLastSeenBelow5Minutes(item.timestamp) ? 'green' : 'inherit', fontWeight: isLastSeenBelow5Minutes(item.timestamp) ? 'bold' : 'normal' }}>
                {calculateTimeDifference(item.timestamp)} ago
              </TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center', color: isLastSeenBelow5Minutes(item.timestamp) ? 'green' : 'inherit', fontWeight: isLastSeenBelow5Minutes(item.timestamp) ? 'bold' : 'normal' }}>
                {ticketlistFormatTimeUTC(item.StartingTime)}
              </TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center', color: isLastSeenBelow5Minutes(item.timestamp) ? 'green' : 'inherit', fontWeight: isLastSeenBelow5Minutes(item.timestamp) ? 'bold' : 'normal' }}>
                {ticketlistFormatTimeUTC(item.timestamp)}
              </TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center', color: 'inherit', fontWeight: 'normal' }}>
              {isNaN(hours) || isNaN(minutes) || isNaN(seconds) || (hours === 0 && minutes === 0 && seconds === 0)
              ? 'N/A'
              : `${hours}h ${minutes}m ${seconds}s`}
              </TableCell>
            </TableRow>
          );
        })}
    </TableBody>
  </Table>
</TableContainer>
    </div>
  )}
  </>
)}{selectedButton === 'Validator Settings' && (
  <>
    {/* Dropdown for Timezone selection */}
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
      {/* <TextField
        label="Device ID"
        variant="outlined"
        size="small"
        style={{ width: '200px' }}
        onChange={(e) => setSearchedDeviceId(e.target.value)}
      /> */}
      <Button variant="contained" color="success" startIcon={<AddIcon />}onClick={vaildatorSettingAddDevice}>
        New device
      </Button>
      <Button variant="contained" onClick = {validatorSettingsCallApi}>
        Reload
      </Button>
    </Stack>
    {validatorSettingsApiLoading ? (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <CircularProgress style={{ marginTop: '20px' }} />
      </div>
    ) : (
<TableContainer style={{ marginTop: '20px', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
    {validatorSettingsApiLoading ? (
      <CircularProgress />
    ) : validatorSettingsApiResponse ? (
      <Table>
        <TableHead>
          <TableRow>
          <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Device ID</TableCell>
          <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Ble TxPower</TableCell>
          <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Ibeacon Minor</TableCell>
          <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>device Mode</TableCell>
          <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {validatorSettingsApiResponse.deviceId.map((deviceId) => {
            const deviceConfigData = deviceConfigDataArray.find((data) => data.deviceId === deviceId);
            let deviceMode = 'Invalid Data';

            if (deviceConfigData) {
              const deviceTicketTelematricHybridMode = deviceConfigData?.gps?.deviceTicketTelematricHybridMode;
              if (deviceTicketTelematricHybridMode === 1) {
                deviceMode = 'GPS mode';
              } else if (deviceTicketTelematricHybridMode === 0) {
                deviceMode = 'Ticket mode';
              } else if (deviceTicketTelematricHybridMode === 2) {
                deviceMode = 'Hybrid mode';
              }
            }
            return (
              <TableRow key={deviceId}>
                <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{deviceId}</TableCell>
                <TableCell style={{ fontSize: '1.0em',textAlign: 'center' }}>{deviceConfigData?.ble?.bleTxPower}</TableCell>
                <TableCell style={{ fontSize: '1.0em',  textAlign: 'center' }}>{deviceConfigData?.ble?.ibeaconMinor}</TableCell>
                <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{deviceMode}</TableCell>
                <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                <Button variant="contained" style={{ marginRight: '15px' }} endIcon={<EditIcon />}>
                  EDIT
                </Button>
                <Button
                  variant="contained"
                  style={{ marginRight: '15px' }}
                  endIcon={<WifiIcon />}
                  onClick={() => validatorSettingWifiButtonClick(deviceId)}
                >
                  WIFI
                </Button>
                <Button
                  variant="contained"
                  style={{ marginRight: '15px' }}
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleValidatorSettingDelete(deviceId)}
                >
                  Delete
                </Button>
              </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    ) : null}
  </TableContainer>
    )}
    {}
  </>
)}
        
  </div>
  );
}

export default App;