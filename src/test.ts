import ts from 'typescript';

if (666) {
  const configFile = ts.readConfigFile('.', ts.sys.readFile);
console.log(configFile);
}

