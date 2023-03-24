const { Schema, model } = require("mongoose");
const validator = require("validator");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid phone number");
        }
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    address: String,
    website: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema);

module.exports = Contact;
