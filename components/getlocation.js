
import Geolocation from 'react-native-geolocation-service';


const sendCurrentLocation = async () => {

    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMessage = [{
            _id: Math.random().toString(),
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'Me',
            },
            location: {
              latitude,
              longitude,
            },
          }];
         handleSend(locationMessage);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Error sending location:', error);
    }
  };
  export default sendCurrentLocation;