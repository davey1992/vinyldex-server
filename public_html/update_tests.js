const express = require('express');
const router = express.Router();

router.get('/update/list-entry', (req, res) => {
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

      fetch('/update/list-entry', {
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

router.get('/update/relationship', (req, res) => {
  const customJSON = JSON.stringify({
    user_id: 1,
    target_user_id: 2,
    relationship_types: { status: "active" }
  });
  
  res.send(`
    <h2>Sending hardcoded JSON for Relationship...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/update/relationship', {
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

router.get('/update/media-condition', (req, res) => {
  const customJSON = JSON.stringify([{
    condition: 'Mint',
    description: 'Pristine copy, unplayed or archive condition'
  },
  {
    condition: 'Cool',
    description: 'Cool copy'
  },
  {
    condition: 'Poot',
    description: 'Poor copy'
  }
]);
  
  res.send(`
    <h2>Sending hardcoded JSON for Media Condition...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/update/media-condition', {
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

router.get('/update/genre', (req, res) => {
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

      fetch('/update/genre', {
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

router.get('/update/list', (req, res) => {
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

      fetch('/update/list', {
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

router.get('/update/entry-genre', (req, res) => {
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

      fetch('/update/entry-genre', {
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


router.get('/update/entry', (req, res) => {
  const customJSON = JSON.stringify(
    [
      {
        "values": {
          "title": "Ohhh yooooo",
          "personal_rating": 10
        },
        "search": [
          {
            "field": "id",
            "value": 326
          },
        ]
      },
      {
        "values": {
          "title": "Ohhh cooooool",
          "personal_rating": 10
        },
        "search": [
          {
            "field": "id",
            "value": 353
          }
        ]
      }
    ]
  );
  
  res.send(`
    <h2>Sending hardcoded entry JSON...</h2>
    <script>
      const payload = ${JSON.stringify(customJSON)};

      fetch('/update/entry', {
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

router.get('/update/user', (req, res) => {
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

      fetch('/update/user', {
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