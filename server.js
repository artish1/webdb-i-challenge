const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();
server.use(express.json());

//Get all accounts
server.get("/", (req, res) => {
  db.select("*")
    .from("accounts")
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => {
      console.log("Error getting accounts:", err);
      res.status(500).json({ error: "Could not get accounts" });
    });
});

//Get account by id
server.get("/:id", (req, res) => {
  const id = req.params.id;
  db("accounts")
    .where({ id })
    .then(accounts => {
      console.log("Accounts: ", accounts);
      if (accounts.length > 0) {
        res.json({ accounts });
      } else {
        res.status(404).json({ error: "Could not find account by that id" });
      }
    })
    .catch(err => {
      console.log("error getting account by id: ", err);
      res.status(500).json({ error: "Server error, could not get account" });
    });
});

//Edit account by id
server.put("/:id", (req, res) => {
  const id = req.params.id;
  db("accounts")
    .where({ id })
    .update(req.body)
    .then(recordsUpdated => {
      if (recordsUpdated > 0) {
        res
          .status(200)
          .json({ message: `${recordsUpdated} record(s) updated` });
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    })
    .catch(err => {
      console.log("Error updating: ", err);
      res.status(500).json({ error: "Could not update account" });
    });
});

//Make an account
server.post("/", (req, res) => {
  if (!req.body.name || !req.body.budget) {
    res.status(400).json({ error: "name and budget fields are required" });
  } else {
    db("accounts")
      .insert(req.body, "id")
      .then(result => {
        res.status(201).json(result);
      })
      .catch(err => {
        console.log("Error making new account", err);
        res.status(500).json({ error: "Could not make new account" });
      });
  }
});

module.exports = server;
