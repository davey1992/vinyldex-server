const express = require('express');
const router = express.Router();


router.get('/add/list-entry', (req, res) => {
  const customJSON = JSON.stringify({
    listID: 1,
    entryID: 1,
    positionOrder: 1
  });
  
  res.send(`
    <h2>Sending hardcoded JSON for List Entry...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/list-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/relationship', (req, res) => {
  const customJSON = JSON.stringify({
    userID: 1,
    targetUserID: 2,
    relationshipTypes: { status: "active" }
  });
  
  res.send(`
    <h2>Sending hardcoded JSON for Relationship...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/relationship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/media-condition', (req, res) => {
  const customJSON = JSON.stringify({
    condition: 'Mint',
    description: 'Pristine copy, unplayed or archive condition'
  });
  
  res.send(`
    <h2>Sending hardcoded JSON for Media Condition...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/media-condition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/genre', (req, res) => {
  const customJSON = JSON.stringify({
    "parentID": null,
    "genreName": 'Happy Hardcore',
    "genreDescription": "Happy Hardcore"
  });
  
  res.send(`
    <h2>Sending hardcoded JSON...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/list', (req, res) => {
  const customJSON = JSON.stringify({
    "userID": 99,
    "name": 'Happy Hardcore',
    "description": "Davey's Favourite Happy Hardcore collection",
    "type": 1,
    "isPublic": true,
    "state": {},
    "properties": {}
  });
  
  res.send(`
    <h2>Sending hardcoded JSON...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/entry-genre', (req, res) => {
  const customJSON = JSON.stringify({
    "entryID": 1,
    "genreID": 1
  });
  
  res.send(`
    <h2>Sending hardcoded JSON...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/entry-genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});


router.get('/add/entry', (req, res) => {
  const customJSON = JSON.stringify({
    "userID": 1,
    "parentID": null,
    "title": "Hardcore Will Never Die",
    "artist": "DJ Demo",
    "location": "Box A - Row 2",
    "itemRef": "JAL-001",
    "mediaCondition": 2,
    "sleeveCondition": 3,
    "personalRating": 9,
    "bpm": 170,
    "spinSpeed": "33",
    "artWork": "default_cover.jpg",
    "mediaFormat": 1,
    "camelotCode": "8A",
    "internalDuplicate": 0,
    "labelName": "Just Another Label",
    "countryCode": "UK",
    "purchasePrice": 14.99,
    "releaseYear": 1995,
    "notes": "Classic 90s piano rave anthem",
    "discogsReleaseID": 123456,
    "catalogNumber": "JALOS01",
    "properties": null
  });
  
  res.send(`
    <h2>Sending hardcoded entry JSON...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/user', (req, res) => {
  const customJSON = JSON.stringify({
    "displayName": "Davey@@",
    "email": "dev@davey92.com",
    "password": "password_gen",
    "passwordMatch": "password_gen",
    "accountType": "1",
    "visibility": "1",
    "state": null,
    "properties": null 
  });
  
  res.send(`
    <h2>Sending hardcoded JSON...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/add/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

module.exports = router;