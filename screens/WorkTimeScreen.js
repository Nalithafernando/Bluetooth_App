import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const WorkTimeScreen = ({ route }) => {
  const { latitude, longitude } = route.params || {}; 

  const [workEntries, setWorkEntries] = useState([]);
  const [isWorking, setIsWorking] = useState(false);

  const handleWorkToggle = () => {
    const currentTime = new Date();

    if (!isWorking) {
      // Start work
      setWorkEntries([...workEntries, { start: currentTime }]);
    } else {
      // End work
      const updatedEntries = workEntries.map(entry => {
        if (!entry.end) {
          return { ...entry, end: currentTime };
        }
        return entry;
      });
      setWorkEntries(updatedEntries);
    }

    setIsWorking(!isWorking);
  };

  const calculateTotalWorkedTime = () => {
    let totalWorkedTime = 0;

    workEntries.forEach(entry => {
      if (entry.start && entry.end) {
        const elapsedTime = entry.end.getTime() - entry.start.getTime();
        totalWorkedTime += elapsedTime;
      }
    });

    return totalWorkedTime / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={isWorking ? "End Work" : "Start Work"} onPress={handleWorkToggle} disabled={false} />
      <Text style={{ color: 'black' }}>Location: {`Latitude: ${latitude}, Longitude: ${longitude}`}</Text>
      {workEntries.map((entry, index) => (
        <View key={index}>
          <Text style={{ marginTop: 20, color: 'black' }}>Start Time: {entry.start ? entry.start.toLocaleTimeString() : ''}</Text>
          <Text style={{ color: 'black' }}>End Time: {entry.end ? entry.end.toLocaleTimeString() : ''}</Text>
        </View>
      ))}
      <Text style={{ color: 'black' }}>Total Worked Time (hours): {calculateTotalWorkedTime()}</Text>
    </View>
  );
};

export default WorkTimeScreen;
