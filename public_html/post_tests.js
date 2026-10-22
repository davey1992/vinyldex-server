const express = require('express');
const router = express.Router();

router.get('/add/list-entry', (req, res) => {
  const customJSON = JSON.stringify([
    {
      list_id: 1,
      entry_id: 1,
      position_order: 1
    },
    {
      list_id: 1,
      entry_id: 2,
      position_order: 2
    },
    {
      list_id: 1,
      entry_id: 3,
      position_order: 3
    },
  ]
);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/relationship', (req, res) => {
  const customJSON = JSON.stringify({
    user_id: 1,
    target_user_id: 2,
    relationship_types: { status: "active" }
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/media-condition', (req, res) => {
  const customJSON = JSON.stringify([{
    condition: 'Mint',
    description: 'Pristine copy, unplayed or archive condition'
  },
  {
    condition: 'Cool1',
    description: 'Cool copy1'
  },
  {
    condition: 'Poot2',
    description: 'Poor copy2'
  }
]);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/genre', (req, res) => {
  const customJSON = JSON.stringify([
  {
    "parent_id": null,
    "genre_name": 'Happy Hardcore',
    "genre_description": "Happy Hardcore"
  },
  {
    "parent_id": null,
    "genre_name": 'Rave',
    "genre_description": "Happy Hardcore"
  },
]);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/list', (req, res) => {
  const customJSON = JSON.stringify([
    {
      "user_id": 1,
      "name": 'Happy Hardcore',
      "description": "Davey's Favourite Happy Hardcore collection",
      "type": 1,
      "is_public": true,
      "state": {},
      "properties": {}
    },
    {
      "user_id": 2,
      "name": 'Happy Hardcore',
      "description": "Davey's Favourite Happy Hardcore collection",
      "type": 1,
      "is_public": true,
      "state": {},
      "properties": {}
    }
]);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/entry-genre', (req, res) => {
  const customJSON = JSON.stringify([
    {
      "entry_id": 1,
      "genre_id": 2
    },
    {
      "entry_id": 1,
      "genre_id": 3
    },
  ]);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});


router.get('/add/entry', (req, res) => {
  const customJSON = JSON.stringify([
  {
    "user_id": 1,
    "parent_id": null,
    "title": "Invincible",
    "artist": "Dougal & Innovate",
    "location": "Front Room",
    "media_condition": 1,
    "sleeve_condition": 1,
    "personal_rating": 10,
    "bpm": 180,
    "spin_speed": "45",
    "art_work": "default_cover.jpg",
    "media_format": 1,
    "camelot_code": "9A",
    "internal_duplicate": 0,
    "label_name": "Kniteforce Records",
    "country_code": "UK",
    "purchase_price": 18.50,
    "release_year": 1995,
    "notes": "Absolute masterclass sang by Jenna",
    "properties": null
  },
]);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

router.get('/add/user', (req, res) => {
  const customJSON = JSON.stringify([
    {
      "display_name": "Angela",
      "email": "angela@davey92.com",
      "password": "password_gen1",
      "password_match": "password_gen1",
      "account_type": "2",
      "visibility": "1",
      "state": null,
      "properties": null 
    }
  ]);
  
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
      .then(data => log('Success:', data))
      .catch(error => console.error('Error:', error));
    </script>
  `);
});

module.exports = router;