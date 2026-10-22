const express = require('express');
const router = express.Router();

router.get('/update/list-entry', (req, res) => {
    const customJSON = JSON.stringify(
    [
      {
        "values": {
          "entry_id": 73 
        },
        "search": [
          {
            "field": "id",
            "value": 3
          }
        ]
      }
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

router.get('/update/media-condition', (req, res) => {
   const customJSON = JSON.stringify(
    [
      {
        "values": {
          "condition": "Anything" 
        },
        "search": [
          {
            "field": "id",
            "value": 33
          }
        ]
      }
    ]
  );
  
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
   const customJSON = JSON.stringify(
    [
      {
        "values": {
          "genre_name": "Appy Ardcore" 
        },
        "search": [
          {
            "field": "id",
            "value": 7
          }
        ]
      }
    ]
  );
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
  const customJSON = JSON.stringify(
    [
      {
        "values": {
          "name": "Ohhh" 
        },
        "search": [
          {
            "field": "id",
            "value": 1
          }
        ]
      }
    ]
  );
  
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

router.get('/update/entry', (req, res) => {
  const customJSON = JSON.stringify(
    [
      {
        "values": {
          "title": "Ohhh yooooo",
          "personal_rating": 10,
        },
        "search": [
          {
            "field": "id",
            "value": 3269
          }
        ]
      },
      {
        "values": {
          "title": "Ohhh cooooool",
          "personal_rating": 10,
          "user_id": 999
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

router.get('/update/entry-genre', (req, res) => {
  const customJSON = JSON.stringify(
    [
      {
        "values": {
          "genre_id": 2
        },
        "search": [
          {
            "field": "id",
            "value": 1
          }
        ]
      }
    ]
  );
  
  res.send(`
    <h2>Sending hardcoded entry JSON...</h2>
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

router.get('/update/relationship', (req, res) => {
 const customJSON = JSON.stringify(
    [
      {
        "values": {
          "target_user_id": "92"
        },
        "search": [
          {
            "field": "id",
            "value": 1
          }
        ]
      }
    ]
  );
  
  res.send(`
    <h2>Sending hardcoded JSON...</h2>
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

router.get('/update/user', (req, res) => {
 const customJSON = JSON.stringify(
    [
      {
        "values": {
          "display_name": "Daveeeeey",
          "password": "TEST12345"
        },
        "search": [
          {
            "field": "id",
            "value": 1
          }
        ]
      }
    ]
  );
  
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