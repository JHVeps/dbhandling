import React, {useState} from 'react';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {init, addGame, deleteGame, fetchAllGames} from './database/db';

init()
  .then(() => {
    console.log('Database creation succeeded!');
  })
  .catch(err => {
    console.log('Database IS NOT initialized! ' + err);
  });

const App = () => {
  const [gameList, setGamesList] = useState([]);
  const [name, setName] = useState('');
  const [os, setOs] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  const swipeLeft = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0.5, 50],
      outputRange: [0.1, 1],
    });

    const Style = {
      transform: [
        {
          scale,
        },
      ],
    };

    return (
      <View style={styles.swipeLeftStyle}>
        <Animated.Text style={[Style, styles.swipeleftTextStyle]}>
          Delete
        </Animated.Text>
      </View>
    );
  };

  const handleName = text => {
    setName(text);
  };

  const handleOs = text => {
    setOs(text);
  };

  const handleGenre = text => {
    setGenre(text);
  };

  const handleYear = text => {
    setYear(text);
  };

  async function readAllGames() {
    await fetchAllGames()
      .then(res => {
        //The parameter res has the value which is returned from the fetchAllGames function in db.js
        setGamesList(res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        console.log('All Items are read!');
      }); //For debugging purposes to see the routine has ended
  }

  async function saveGame() {
    try {
      const dbResult = await addGame(name, os, genre, year);
      //console.log('dbResult: ' + dbResult); //For debugging purposes to see the data in the console screen
      await readAllGames();
    } catch (err) {
      console.log(err);
    } finally {
      setName('');
      setOs('');
      setGenre('');
      setYear('');
    }
  }

  async function deleteGameFromDb(id) {
    // alert(`Item of ID: ${id} will be deleted`); //For testing purposes
    try {
      const dbResult = await deleteGame(id);
      await readAllGames();
    } catch (err) {
      console.log(err);
    } finally {
      //No need to do anything
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>DB Games Manager app</Text>
      </View>
      <TextInput
        placeholder="Add name..."
        value={name}
        onChangeText={handleName}
        style={styles.inputstyle}
      />
      <TextInput
        placeholder="Add platform..."
        value={os}
        onChangeText={handleOs}
        style={styles.inputstyle}
      />
      <TextInput
        placeholder="Add genre..."
        value={genre}
        onChangeText={handleGenre}
        style={styles.inputstyle}
      />
      <TextInput
        placeholder="Add year..."
        value={year}
        onChangeText={handleYear}
        style={styles.inputstyle}
      />
      <View style={styles.buttonStyle}>
        <Button title="Save" onPress={() => saveGame()} />
      </View>
      <View style={styles.buttonStyle}>
        <Button title="Show saved" onPress={() => readAllGames()} />
      </View>
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsHeaderText}>GAMES</Text>
      </View>
      <SafeAreaView />
      <FlatList
        style={styles.flatListStyle}
        data={gameList}
        ListEmptyComponent={() => (
          <View style={styles.emptyListStyle}>
            <Text>NO GAMES TO DISPLAY</Text>
          </View>
        )}
        renderItem={item => (
          <GestureHandlerRootView>
            <Swipeable
              useNativeAnimations
              overshootLeft={false}
              onSwipeableLeftOpen={() => deleteGameFromDb(item.item.id)}
              renderLeftActions={swipeLeft}>
              <View style={styles.item}>
                <Text style={styles.itemInfoText}>{item.item.name}</Text>
                <View style={styles.itemInfo}>
                  <Text>ID: {item.item.id}</Text>
                  <Text>Genre: {item.item.genre}</Text>
                  <Text>OS: {item.item.os}</Text>
                  <Text>Year: {item.item.year}</Text>
                </View>
              </View>
            </Swipeable>
          </GestureHandlerRootView>
        )}
      />
    </View>
  );
};
//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    padding: 10,
    alignItems: 'center',
  },

  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
  },

  inputstyle: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 2,
    padding: 5,
    width: '90%',
    margin: 5,
  },

  buttonStyle: {
    padding: 2,
    width: '90%',
    margin: 2,
  },

  itemsHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
  },

  itemsHeaderText: {
    fontWeight: '600',
    fontSize: 20,
  },

  emptyListStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatListStyle: {
    flex: 1,
  },

  item: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
  },

  itemInfo: {
    width: '94%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 5,
  },

  itemInfoText: {
    fontWeight: '800',
  },

  swipeLeftStyle: {
    width: 80,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

  swipeleftTextStyle: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default App;
