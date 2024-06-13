const fs = require("fs").promises;
const path = require("path");
require("colors");

const contactsPath = path.join("./db", "contacts.json");
const contactsDataBase = require("./db/contacts.json");

const parseContacts = (data) => JSON.parse(data.toString());

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = parseContacts(data);
    const sortedContacts = [...contacts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    console.table(sortedContacts);
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = parseContacts(data);
    const contact = contacts.filter((contact) => contact.id === contactId);

    if (contacts.length > 0) {
      console.table(contacts);
    } else {
      console.log(`There is no contact with the id: ${contactId}.`.red);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = parseContacts(data);
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex !== -1) {
      contacts.splice(contactIndex, 1);
      await fs.writeFile(contactsPath, JSON.stringify(contacts));
      console.log(`Contact with the id ${contactId} has been removed.`.green);
    } else {
      console.log(`There is no contact with the id: ${contactId}.`.red);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (name, email, phone) => {
  if (!name || !email || !phone) {
    console.log("Please set arguments (name, email, phone) to add contact".red);
    return;
  }

  const { nanoid } = await import("nanoid");

  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contactsDataBase.push(contact);

  try {
    await fs.writeFile(contactsPath, JSON.stringify(contactsDataBase));
    console.log(`${name} has been added to your contacts`.green);
  } catch (error) {
    console.log("Ooops, something went wrong:".red, error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
