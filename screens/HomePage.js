import React,{useState} from 'react';
import {SafeAreaView, View, Text, TextInput, Button, StyleSheet, ScrollView,TouchableOpacity} from 'react-native';

import SideMenu from '../components/SideMenu';


const mockData = [
  { id: '1', name: 'Temp 1', date: '12/12/12', status: 'Reviewed' },
  { id: '2', name: 'Temp 2', date: '12/12/12', status: 'Opened' },

];

const createRows = (data, itemsPerRow) => {
  const rows = [];
  let row = [];
  data.forEach(item => {
    if (row.length === itemsPerRow) {
      rows.push(row);
      row = [item];
    } else {
      row.push(item);
    }
  });
  if (row.length > 0) {
    rows.push(row);
  }
  return rows;
};

export default function HomePage(){
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const rows = createRows(mockData, 2);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.companyHeader}>
      <View style={{flex: 1}}></View>
      <View style={styles.companyNameHWrapper}>
        <Text style={styles.companyName}>Ekyaalo</Text>
      </View>
      <View style={styles.menuButtonContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={{fontSize: 18}}>Menu</Text>
        </TouchableOpacity>
   
      </View>
    </View>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
        />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Filter" onPress={() => { }} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Sort by" onPress={() => { }} />
          </View>
        </View>
      </View>
      <ScrollView style={styles.listContainer}>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            {row.map(item => (
              <View key={item.id} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text>Submitted {item.date}</Text>
                <Text>Status: {item.status}</Text>
                <View style = {styles.itemButtonContainer}>
                  <Button title="View" onPress={() => {  }} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style = {styles.submissionButtonContainer}>
        <TouchableOpacity style={styles.largeButton} onPress={() => {  }}>
          <Text style={styles.largeButtonText}>New Submission</Text>
        </TouchableOpacity>
      </View>
      <SideMenu isVisible={menuVisible} onClose={toggleMenu} />
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  companyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,

  },
  companyNameHWrapper: {
    flex: 1,
    alignItems: 'center',

  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor:'',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    flex: 5,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex:5,
  },
  buttonWrapper: {
    flex: 1, 
    marginHorizontal: 5,
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '45%', 
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontWeight: 'bold',
  },
  itemButtonContainer: {
    marginTop: 10,
    alignItems: 'stretch',
  },  
  submissionButtonContainer: {
    marginBottom: 15,
    paddingHorizontal: 10, 
  },
  largeButton: {
    backgroundColor: '#007bff', 
    paddingVertical: 15,
    borderRadius: 5, 
    alignItems: 'center', 
  },
  largeButtonText: {
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
});
