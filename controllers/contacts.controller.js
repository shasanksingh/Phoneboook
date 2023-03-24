const Contact = require("../models/contact.model");

async function index(req, res) {
  Contact.find({})
    .then((contacts) => {
      res.render("contacts/index", { contacts });
    })
    .catch((error) => {
      console.log(error.message);
      req.flash("error", error.message);
      res.redirect("contacts/create");
    });
}

async function create(req, res) {
  res.render("contacts/create");
}

function store(req, res) {
  Contact.create(req.body)
    .then(() => res.redirect("contacts"))
    .catch((error) => {
      console.log(error.message);
      req.flash("error", error.message);
      res.redirect("contacts/create");
    });
}
async function show(req, res) {}
async function edit(req, res) {}
async function update(req, res) {}
async function destroy(req, res) {}

module.exports = {
  index,
  create,
  store,
  show,
  edit,
  update,
  destroy,
};
