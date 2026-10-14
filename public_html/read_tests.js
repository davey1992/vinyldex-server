const express = require('express');
const router = express.Router();


router.get('/read/entries', (req, res) => {
  const customJSON = JSON.stringify({
    "columns": {
      
    },
    "search": {
      "userID": 1,
      "parentID": null,
      "title": "Let Your Mind Be Free",
      "artist": "Supreme & UFO",
      "location": "Box A - Row 2",
      "itemRef": "KFR-012",
      "mediaCondition": 2,
      "sleeveCondition": 2,
      "personalRating": 10,
      "bpm": 172,
      "spinSpeed": "33",
      "artWork": "default_cover.jpg",
      "mediaFormat": 1,
      "camelotCode": "9A",
      "internalDuplicate": 0,
      "labelName": "Kniteforce Records",
      "countryCode": "UK",
      "purchasePrice": 18.50,
      "releaseYear": 1995,
      "notes": "Absolute masterclass in breakbeat hardcore",
      "discogsReleaseID": 234567,
      "catalogNumber": "KF 012",
      "properties": null
    }
  });


  res.send(`
    <h2>Reading Entries..</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/read/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

  
//   res.send(`
//     <h2>Sending hardcoded JSON for List Entry...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/list-entry', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });

// router.get('/add/relationship', (req, res) => {
//   const customJSON = JSON.stringify({
//     userID: 1,
//     targetUserID: 2,
//     relationshipTypes: { status: "active" }
//   });
  
//   res.send(`
//     <h2>Sending hardcoded JSON for Relationship...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/relationship', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });



// router.get('/add/media-condition', (req, res) => {
//   const customJSON = JSON.stringify([{
//     condition: 'Mint',
//     description: 'Pristine copy, unplayed or archive condition'
//   },
//   {
//     condition: 'Cool',
//     description: 'Cool copy'
//   },
//   {
//     condition: 'Poot',
//     description: 'Poor copy'
//   }
// ]);
  
//   res.send(`
//     <h2>Sending hardcoded JSON for Media Condition...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/media-condition', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });

// router.get('/add/genre', (req, res) => {
//   const customJSON = JSON.stringify([
//   {
//     "parentID": null,
//     "genreName": 'Happy Hardcore',
//     "genreDescription": "Happy Hardcore"
//   },
//   {
//     "parentID": null,
//     "genreName": 'Rave',
//     "genreDescription": "Happy Hardcore"
//   },
// ]);
  
//   res.send(`
//     <h2>Sending hardcoded JSON...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/genre', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });

// router.get('/add/list', (req, res) => {
//   const customJSON = JSON.stringify([
//     {
//       "userID": 1,
//       "name": 'Happy Hardcore',
//       "description": "Davey's Favourite Happy Hardcore collection",
//       "type": 1,
//       "isPublic": true,
//       "state": {},
//       "properties": {}
//     },
//     {
//       "userID": 2,
//       "name": 'Happy Hardcore',
//       "description": "Davey's Favourite Happy Hardcore collection",
//       "type": 1,
//       "isPublic": true,
//       "state": {},
//       "properties": {}
//     }
// ]);
  
//   res.send(`
//     <h2>Sending hardcoded JSON...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/list', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });

// router.get('/add/entry-genre', (req, res) => {
//   const customJSON = JSON.stringify([
//     {
//       "entryID": 1,
//       "genreID": 2
//     },
//     {
//       "entryID": 1,
//       "genreID": 3
//     },
//   ]);
  
//   res.send(`
//     <h2>Sending hardcoded JSON...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/entry-genre', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });


// router.get('/add/entry', (req, res) => {
//   const customJSON = JSON.stringify([
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Let Your Mind Be Free",
//     "artist": "Supreme & UFO",
//     "location": "Box A - Row 2",
//     "itemRef": "KFR-012",
//     "mediaCondition": 2,
//     "sleeveCondition": 2,
//     "personalRating": 10,
//     "bpm": 172,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "9A",
//     "internalDuplicate": 0,
//     "labelName": "Kniteforce Records",
//     "countryCode": "UK",
//     "purchasePrice": 18.50,
//     "releaseYear": 1995,
//     "notes": "Absolute masterclass in breakbeat hardcore",
//     "discogsReleaseID": 234567,
//     "catalogNumber": "KF 012",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Sensations",
//     "artist": "DJ Seduction",
//     "location": "Box A - Row 3",
//     "itemRef": "IMP-005",
//     "mediaCondition": 1,
//     "sleeveCondition": 2,
//     "personalRating": 9,
//     "bpm": 168,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "10A",
//     "internalDuplicate": 0,
//     "labelName": "Impact Records",
//     "countryCode": "UK",
//     "purchasePrice": 12.00,
//     "releaseYear": 1994,
//     "notes": "Incredible uplifting piano hook",
//     "discogsReleaseID": 345678,
//     "catalogNumber": "IMP 005",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Higher Love",
//     "artist": "DJ Vibes",
//     "location": "Box B - Row 1",
//     "itemRef": "ASL-008",
//     "mediaCondition": 2,
//     "sleeveCondition": 3,
//     "personalRating": 8,
//     "bpm": 170,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "8A",
//     "internalDuplicate": 0,
//     "labelName": "As Cool As It Gets",
//     "countryCode": "UK",
//     "purchasePrice": 15.00,
//     "releaseYear": 1996,
//     "notes": "Solid floor filler, minor sleeve ring wear",
//     "discogsReleaseID": 456789,
//     "catalogNumber": "ASL 008",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "It's A Dream",
//     "artist": "Wishdokta",
//     "location": "Box B - Row 2",
//     "itemRef": "DPR-003",
//     "mediaCondition": 1,
//     "sleeveCondition": 1,
//     "personalRating": 10,
//     "bpm": 165,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "7A",
//     "internalDuplicate": 0,
//     "labelName": "Desire Records",
//     "countryCode": "UK",
//     "purchasePrice": 22.00,
//     "releaseYear": 1993,
//     "notes": "Mint copy, massive hardcore anthem",
//     "discogsReleaseID": 567890,
//     "catalogNumber": "DES 03",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Rave Is Your Life",
//     "artist": "DJ Gizmo & The Prophet",
//     "location": "Box C - Row 1",
//     "itemRef": "BBM-019",
//     "mediaCondition": 2,
//     "sleeveCondition": 2,
//     "personalRating": 9,
//     "bpm": 178,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "4A",
//     "internalDuplicate": 0,
//     "labelName": "Babyboom Records",
//     "countryCode": "NL",
//     "purchasePrice": 16.50,
//     "releaseYear": 1995,
//     "notes": "Early Dutch gabber/happy hardcore crossover",
//     "discogsReleaseID": 678901,
//     "catalogNumber": "BBM 019",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Power Zone",
//     "artist": "Vinylgroover",
//     "location": "Box C - Row 2",
//     "itemRef": "HNR-004",
//     "mediaCondition": 3,
//     "sleeveCondition": 3,
//     "personalRating": 7,
//     "bpm": 174,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "11A",
//     "internalDuplicate": 0,
//     "labelName": "Hectic Records",
//     "countryCode": "UK",
//     "purchasePrice": 9.99,
//     "releaseYear": 1996,
//     "notes": "Plays through with some light crackle on intro",
//     "discogsReleaseID": 789012,
//     "catalogNumber": "HCTR 04",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "In Effect",
//     "artist": "Red Alert & Mike Slammer",
//     "location": "Box A - Row 4",
//     "itemRef": "SMM-002",
//     "mediaCondition": 1,
//     "sleeveCondition": 2,
//     "personalRating": 10,
//     "bpm": 167,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "6A",
//     "internalDuplicate": 0,
//     "labelName": "Slammin' Vinyl",
//     "countryCode": "UK",
//     "purchasePrice": 20.00,
//     "releaseYear": 1994,
//     "notes": "Essential dark/happy transition era track",
//     "discogsReleaseID": 890123,
//     "catalogNumber": "SLAM 02",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Spacewave",
//     "artist": "Sy & Demo",
//     "location": "Box D - Row 1",
//     "itemRef": "QITE-011",
//     "mediaCondition": 2,
//     "sleeveCondition": 2,
//     "personalRating": 9,
//     "bpm": 172,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "9A",
//     "internalDuplicate": 0,
//     "labelName": "Quosh Records",
//     "countryCode": "UK",
//     "purchasePrice": 14.00,
//     "releaseYear": 1997,
//     "notes": "Classic late 90s bouncy happy hardcore",
//     "discogsReleaseID": 901234,
//     "catalogNumber": "QUOSH 11",
//     "properties": null
//   },
//   {
//     "userID": 100000,
//     "parentID": null,
//     "title": "Bad Man",
//     "artist": "Leviticus",
//     "location": "Box D - Row 2",
//     "itemRef": "PHD-001",
//     "mediaCondition": 2,
//     "sleeveCondition": 3,
//     "personalRating": 10,
//     "bpm": 162,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "2A",
//     "internalDuplicate": 0,
//     "labelName": "Philly Blunt",
//     "countryCode": "UK",
//     "purchasePrice": 17.50,
//     "releaseYear": 1994,
//     "notes": "Jungle / ragga hardcore staple, massive bassline",
//     "discogsReleaseID": 102345,
//     "catalogNumber": "PB 001",
//     "properties": null
//   },
//   {
//     "userID": 1,
//     "parentID": null,
//     "title": "The Way",
//     "artist": "Darren Styles",
//     "location": "Box D - Row 3",
//     "itemRef": "UPL-007",
//     "mediaCondition": 1,
//     "sleeveCondition": 1,
//     "personalRating": 8,
//     "bpm": 175,
//     "spinSpeed": "33",
//     "artWork": "default_cover.jpg",
//     "mediaFormat": 1,
//     "camelotCode": "5A",
//     "internalDuplicate": 0,
//     "labelName": "Uplifting Records",
//     "countryCode": "UK",
//     "purchasePrice": 13.50,
//     "releaseYear": 1998,
//     "notes": "Clean copy, pristine gloss",
//     "discogsReleaseID": 213456,
//     "catalogNumber": "UP 07",
//     "properties": null
//   }]);
  
//   res.send(`
//     <h2>Sending hardcoded entry JSON...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/entry', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });

// router.get('/add/user', (req, res) => {
//   const customJSON = JSON.stringify([
//     {
//       "displayName": "Angela",
//       "email": "angela@davey92.com",
//       "password": "password_gen1",
//       "passwordMatch": "password_gen1",
//       "accountType": "2",
//       "visibility": "1",
//       "state": null,
//       "properties": null 
//     }
//   ]);
  
//   res.send(`
//     <h2>Sending hardcoded JSON...</h2>
//     <script>
//       const payload = ${JSON.stringify(customJSON)};

//       fetch('/add/user', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: payload
//       })
//       .then(response => response.json())
//       .then(data => log('Success:', data))
//       .catch(error => console.error('Error:', error));
//     </script>
//   `);
// });

module.exports = router;