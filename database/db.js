/* eslint-disable prettier/prettier */
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'games.db'});
var tableName = 'game';
//method returns a Promise - in the calling side .then(...).then(...)....catch(...) can be used
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      // tx.executeSql('DROP TABLE IF EXISTS boot', []); //uncomment this if needed - sometimes it is good to empty the table
      //By default, primary key is auto_incremented - we do not add anything to that column
      tx.executeSql(
        'create table if not exists ' +
          tableName +
          '(id integer not null primary key, name text not null, os text not null, genre text not null, year integer not null);',
        [], //second parameters of execution:empty square brackets - this parameter is not needed when creating table
        //If the transaction succeeds, this is called
        () => {
          resolve(); //There is no need to return anything
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const addGame = (name, os, genre, year) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we use the Prepared statement, just putting placeholders to the values to be inserted
      tx.executeSql(
        'insert into ' + tableName + '(name, os, genre, year) values(?,?,?,?);',
        //And the values come here
        [name, os, genre, year],
        //If the transaction succeeds, this is called
        () => {
          resolve();
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const deleteGame = id => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we use the Prepared statement, just putting placeholders to the values to be inserted
      tx.executeSql(
        'delete from ' + tableName + ' where id=?;',
        //And the values come here
        [id],
        //If the transaction succeeds, this is called
        () => {
          resolve();
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const fetchAllGames = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we select all from the table fish
      tx.executeSql(
        'select * from ' + tableName,
        [],
        (tx, result) => {
          let items = []; //Create a new empty Javascript array
          //And add all the items of the result (database rows/records) into that table
          for (let i = 0; i < result.rows.length; i++) {
            items.push(result.rows.item(i)); //The form of an item is {"type": "Leather boot", "id": 1, "size": 47}
            //console.log(result.rows.item(i)); //For debugging purposes to see the data in console window
          }
          //console.log(items); //For debugging purposes to see the data in console window
          resolve(items); //The data the Promise will have when returned
        },
        (tx, err) => {
          console.log('Err');
          console.log(err);
          reject(err);
        },
      );
    });
  });
  return promise;
};
