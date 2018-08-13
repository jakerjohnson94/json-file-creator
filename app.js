const writeJsonFile = require('write-json-file');
const express = require('express');

const request = require('request');
const rp = require('request-promise');
const app = express();
app.use(express.json());

const POKEMON_API_URL = 'http://pokeapi.co/api/v2/pokemon/';
const numOfPokemon = 50;
const offset = 0;

function getPokemonNumbers() {
  let nums = new Array(numOfPokemon).fill(offset).map((a, b) => (a = b + 1));
  let obj = [];
  nums.forEach(num => {
    const option = {
      uri: `${POKEMON_API_URL + num}`,

      headers: {
        'User-Agent': 'Request-Promise',
      },
      json: true, // Automatically parses the JSON string in the response
    };
    rp(option)
      .then(function(body) {
        console.log(body.name);
        obj.push([
          {
            name: body.name,
            id: body.id,
            types: body.types,
            abilities: body.abilities,
            stats: body.stats,
            types: body.types,
            sprites: body.sprites,
          },
          body.id,
        ]);
      })
      .then(() => {
        if (obj.length === nums.length) {
          const idRange = nums[0] + '-' + nums[nums.length - 1];
          obj = obj.sort((a, b) => a[1] - b[1]);
          obj = obj.map(a => a[0]);
          writeJsonFile(`pokemon_${idRange}.json`, obj);
        }
      })
      .then(() => {
        obj.length === nums.length
          ? console.log(`all done with, ${obj.length} entries`)
          : console.log('added...');
      })

      .catch(function(err) {
        console.error(err.message);
      });
  });
}

getPokemonNumbers();

app.listen(3003);
