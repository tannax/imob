const SQLiteStorage = require('react-native-sqlite-storage');

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = SQLiteStorage.openDatabase({
      name: 'cadastros.db',
      location: 'default',
    });

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cadastros (id INTEGER PRIMARY KEY, endereço TEXT, finalidade TEXT, tipo TEXT, valor REAL)',
        [],
        () => {
          console.log('Table created successfully');
          resolve(db); // Resolve with the initialized db instance
        },
        error => {
          console.log('Error creating table:', error);
          reject(error);
        }
      );
    });
  });
};

const addCadastro = (db, endereço, finalidade, tipo, valor) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO cadastros (endereço, finalidade, tipo, valor) VALUES (?, ?, ?, ?)',
      [endereço, finalidade, tipo, valor],
      () => {
        console.log('Cadastro added successfully');
      },
      error => {
        console.log('Error adding cadastro:', error);
      }
    );
  });
};

const getCadastros = db => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cadastros',
        [],
        (_tx, result) => {
          const cadastros = [];
          for (let i = 0; i < result.rows.length; i++) {
            cadastros.push(result.rows.item(i));
          }
          resolve(cadastros);
        },
        error => {
          console.log('Error getting cadastros:', error);
          reject(error);
        }
      );
    });
  });
};

// Usage example
initializeDatabase()
  .then(db => {
    addCadastro(db, 'Rua das Flores, 123', 'aluguel', 'casa', 100000);
    addCadastro(db, 'Avenida Paulista, 1000', 'venda', 'apartamento', 2000000);

    getCadastros(db)
      .then(cadastros => {
        console.log('All cadastros:', cadastros);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  })
  .catch(error => {
    console.log('Error initializing database:', error);
  });
