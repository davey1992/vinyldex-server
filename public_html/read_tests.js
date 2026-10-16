const express = require('express');
const router = express.Router();


router.get('/read/entries', (req, res) => {
  const customJSON = JSON.stringify({
    columns: [
      "user_id",
      "title",
      "artist",
      "bpm"
    ],
    search: [
      {
        field: "title",
        value: "The Way",
        operator : "LIKE",
        caseSensitive: true
      },
      {
        field: "user_id",
        value: 1,
        operator : "="
      },
    ]
  });
  // "user_id": 1,
  //     "parent_id": null,
  //     "title": "Let Your Mind Be Free",
  //     "artist": "Supreme & UFO",
  //     "location": "Box A - Row 2",
  //     "item_ref": "KFR-012",
  //     "media_condition": 2,
  //     "sleeve_condition": 2,
  //     "personal_rating": 10,
  //     "bpm": 172,
  //     "spin_speed": "33",
  //     "art_work": "default_cover.jpg",
  //     "media_format": 1,
  //     "camelot_code": "9A",
  //     "internal_duplicate": 0,
  //     "label_name": "Kniteforce Records",
  //     "country_code": "UK",
  //     "purchase_price": 18.50,
  //     "release_year": 1995,
  //     "notes": "Absolute masterclass in breakbeat hardcore",
  //     "discogs_release_id": 234567,
  //     "catalog_number": "KF 012",
  //     "properties": null


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
//     user_id: 1,
//     target_user_id: 2,
//     relationship_types: { status: "active" }
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
//     "parent_id": null,
//     "genre_name": 'Happy Hardcore',
//     "genre_description": "Happy Hardcore"
//   },
//   {
//     "parent_id": null,
//     "genre_name": 'Rave',
//     "genre_description": "Happy Hardcore"
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
//       "user_id": 1,
//       "name": 'Happy Hardcore',
//       "description": "Davey's Favourite Happy Hardcore collection",
//       "type": 1,
//       "is_public": true,
//       "state": {},
//       "properties": {}
//     },
//     {
//       "user_id": 2,
//       "name": 'Happy Hardcore',
//       "description": "Davey's Favourite Happy Hardcore collection",
//       "type": 1,
//       "is_public": true,
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
//       "entry_id": 1,
//       "genre_id": 2
//     },
//     {
//       "entry_id": 1,
//       "genre_id": 3
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
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Let Your Mind Be Free",
//     "artist": "Supreme & UFO",
//     "location": "Box A - Row 2",
//     "item_ref": "KFR-012",
//     "media_condition": 2,
//     "sleeve_condition": 2,
//     "personal_rating": 10,
//     "bpm": 172,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "9A",
//     "internal_duplicate": 0,
//     "label_name": "Kniteforce Records",
//     "country_code": "UK",
//     "purchase_price": 18.50,
//     "release_year": 1995,
//     "notes": "Absolute masterclass in breakbeat hardcore",
//     "discogs_release_id": 234567,
//     "catalog_number": "KF 012",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Sensations",
//     "artist": "DJ Seduction",
//     "location": "Box A - Row 3",
//     "item_ref": "IMP-005",
//     "media_condition": 1,
//     "sleeve_condition": 2,
//     "personal_rating": 9,
//     "bpm": 168,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "10A",
//     "internal_duplicate": 0,
//     "label_name": "Impact Records",
//     "country_code": "UK",
//     "purchase_price": 12.00,
//     "release_year": 1994,
//     "notes": "Incredible uplifting piano hook",
//     "discogs_release_id": 345678,
//     "catalog_number": "IMP 005",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Higher Love",
//     "artist": "DJ Vibes",
//     "location": "Box B - Row 1",
//     "item_ref": "ASL-008",
//     "media_condition": 2,
//     "sleeve_condition": 3,
//     "personal_rating": 8,
//     "bpm": 170,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "8A",
//     "internal_duplicate": 0,
//     "label_name": "As Cool As It Gets",
//     "country_code": "UK",
//     "purchase_price": 15.00,
//     "release_year": 1996,
//     "notes": "Solid floor filler, minor sleeve ring wear",
//     "discogs_release_id": 456789,
//     "catalog_number": "ASL 008",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "It's A Dream",
//     "artist": "Wishdokta",
//     "location": "Box B - Row 2",
//     "item_ref": "DPR-003",
//     "media_condition": 1,
//     "sleeve_condition": 1,
//     "personal_rating": 10,
//     "bpm": 165,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "7A",
//     "internal_duplicate": 0,
//     "label_name": "Desire Records",
//     "country_code": "UK",
//     "purchase_price": 22.00,
//     "release_year": 1993,
//     "notes": "Mint copy, massive hardcore anthem",
//     "discogs_release_id": 567890,
//     "catalog_number": "DES 03",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Rave Is Your Life",
//     "artist": "DJ Gizmo & The Prophet",
//     "location": "Box C - Row 1",
//     "item_ref": "BBM-019",
//     "media_condition": 2,
//     "sleeve_condition": 2,
//     "personal_rating": 9,
//     "bpm": 178,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "4A",
//     "internal_duplicate": 0,
//     "label_name": "Babyboom Records",
//     "country_code": "NL",
//     "purchase_price": 16.50,
//     "release_year": 1995,
//     "notes": "Early Dutch gabber/happy hardcore crossover",
//     "discogs_release_id": 678901,
//     "catalog_number": "BBM 019",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Power Zone",
//     "artist": "Vinylgroover",
//     "location": "Box C - Row 2",
//     "item_ref": "HNR-004",
//     "media_condition": 3,
//     "sleeve_condition": 3,
//     "personal_rating": 7,
//     "bpm": 174,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "11A",
//     "internal_duplicate": 0,
//     "label_name": "Hectic Records",
//     "country_code": "UK",
//     "purchase_price": 9.99,
//     "release_year": 1996,
//     "notes": "Plays through with some light crackle on intro",
//     "discogs_release_id": 789012,
//     "catalog_number": "HCTR 04",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "In Effect",
//     "artist": "Red Alert & Mike Slammer",
//     "location": "Box A - Row 4",
//     "item_ref": "SMM-002",
//     "media_condition": 1,
//     "sleeve_condition": 2,
//     "personal_rating": 10,
//     "bpm": 167,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "6A",
//     "internal_duplicate": 0,
//     "label_name": "Slammin' Vinyl",
//     "country_code": "UK",
//     "purchase_price": 20.00,
//     "release_year": 1994,
//     "notes": "Essential dark/happy transition era track",
//     "discogs_release_id": 890123,
//     "catalog_number": "SLAM 02",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Spacewave",
//     "artist": "Sy & Demo",
//     "location": "Box D - Row 1",
//     "item_ref": "QITE-011",
//     "media_condition": 2,
//     "sleeve_condition": 2,
//     "personal_rating": 9,
//     "bpm": 172,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "9A",
//     "internal_duplicate": 0,
//     "label_name": "Quosh Records",
//     "country_code": "UK",
//     "purchase_price": 14.00,
//     "release_year": 1997,
//     "notes": "Classic late 90s bouncy happy hardcore",
//     "discogs_release_id": 901234,
//     "catalog_number": "QUOSH 11",
//     "properties": null
//   },
//   {
//     "user_id": 100000,
//     "parent_id": null,
//     "title": "Bad Man",
//     "artist": "Leviticus",
//     "location": "Box D - Row 2",
//     "item_ref": "PHD-001",
//     "media_condition": 2,
//     "sleeve_condition": 3,
//     "personal_rating": 10,
//     "bpm": 162,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "2A",
//     "internal_duplicate": 0,
//     "label_name": "Philly Blunt",
//     "country_code": "UK",
//     "purchase_price": 17.50,
//     "release_year": 1994,
//     "notes": "Jungle / ragga hardcore staple, massive bassline",
//     "discogs_release_id": 102345,
//     "catalog_number": "PB 001",
//     "properties": null
//   },
//   {
//     "user_id": 1,
//     "parent_id": null,
//     "title": "The Way",
//     "artist": "Darren Styles",
//     "location": "Box D - Row 3",
//     "item_ref": "UPL-007",
//     "media_condition": 1,
//     "sleeve_condition": 1,
//     "personal_rating": 8,
//     "bpm": 175,
//     "spin_speed": "33",
//     "art_work": "default_cover.jpg",
//     "media_format": 1,
//     "camelot_code": "5A",
//     "internal_duplicate": 0,
//     "label_name": "Uplifting Records",
//     "country_code": "UK",
//     "purchase_price": 13.50,
//     "release_year": 1998,
//     "notes": "Clean copy, pristine gloss",
//     "discogs_release_id": 213456,
//     "catalog_number": "UP 07",
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
//       "display_name": "Angela",
//       "email": "angela@davey92.com",
//       "password": "password_gen1",
//       "password_match": "password_gen1",
//       "account_type": "2",
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