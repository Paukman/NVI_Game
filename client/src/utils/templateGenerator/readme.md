How to generate new file:

1. Create configuration file. Use ModuleConfiguration.js as a template.
2. From client directory execute folowing
   node src/utils/templates/generate.js ModuleConfiguration.js
3. Clean the code

How to create queries in FE

1. create you config file in PageConfig. Use /queriesTemplate.js as you template. for mutaton or queries use only one either query or mutation not both in the same object.
2. from client run node command:
   node src/utils/templateGenerator/queriesGenerator.js <your config file>
