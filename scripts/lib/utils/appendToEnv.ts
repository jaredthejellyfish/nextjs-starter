import * as fs from 'fs';

const appendToEnv = (envFile: string) => {
  // ensure the .env file exists
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', '');
  }

  return new Promise((resolve, reject) => {
    fs.appendFile('.env', envFile, (err) => {
      if (err) {
        reject(err);
      }

      resolve(true);
    });
  });
};

export default appendToEnv;
