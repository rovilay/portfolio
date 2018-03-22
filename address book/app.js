// Storage Controller
const StorageCtrl = (function () {

  // Public methods
  return {
    storeContact: function (contact) {
      let contacts;
      // Check if any contacts in Ls
      if (localStorage.getItem('contacts') === null) {
        contacts = [];
        //Push new contact
        contacts.push(contact);
        // Set Ls
        localStorage.setItem('contacts', JSON.stringify(contacts));
      } else {
        // Get contacts from Ls
        contacts = JSON.parse(localStorage.getItem('contacts'));

        // Push new contact
        contacts.push(contact);

        // Arrange by Last Name
        contacts = contacts.sort(StorageCtrl.sortContacts)

        // Reset Ls
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }
    },

    sortContacts: function(a, b) {
      // Use toUpperCase() to ignore character casing
      const contactA = a.lastName.toUpperCase();
      const contactB = b.lastName.toUpperCase();
    
      let comparison = 0;
      if (contactA > contactB) {
        comparison = 1;
      } else if (contactA < contactB) {
        comparison = -1;
      }
      return comparison;
    },

    getContactFromLs: function () {
      let contacts;
      if (localStorage.getItem('contacts') === null) {
        contacts = [];
      } else {
        contacts = JSON.parse(localStorage.getItem('contacts'));
      }

      return contacts;
    },

    updateContactFromLs: function (updatedContact) {
      let contacts = JSON.parse(localStorage.getItem('contacts'));

      contacts.forEach(function (contact, index) {
        if (updatedContact.id === contact.id) {
          contacts.splice(index, 1, updatedContact);
        }
      });

      localStorage.setItem('contacts', JSON.stringify(contacts));
    },

    deleteContactFromLs: function (id) {
      let contacts = JSON.parse(localStorage.getItem('contacts'));

      contacts.forEach(function (contact, index) {
        if (id === contact.id) {
          contacts.splice(index, 1);
        }
      });

      localStorage.setItem('contacts', JSON.stringify(contacts));
    },

    clearAllContactsFromLs: function () {
      localStorage.removeItem('contacts');
    }
  };
})();

// Contact Controller
// this is an IIFE
// private methods
const ContactCtrl = (function () {

  // Contact Contructor
  const Contact = function (contactInfo) {
    this.id = contactInfo.id;
    this.firstName = contactInfo.firstName;
    this.lastName = contactInfo.lastName;
    this.email = contactInfo.email;
    this.email2 = contactInfo.email2;
    this.address = contactInfo.address;
    this.address2 = contactInfo.address2;
    this.phone = contactInfo.phone;
    this.phone2 = contactInfo.phone2;
    this.city = contactInfo.city;
    this.state = contactInfo.state;
    this.country = contactInfo.country;
  };

  // Data Structure and state
  const data = {
    contacts: StorageCtrl.getContactFromLs(),
    currentContact: null,
  };


  // Return to make it a public method
  return {
    getData: function () {
      return data.contacts;
    },

    addContact: function (input) {


      if (data.contacts.length > 0) {
        input.id = data.contacts[data.contacts.length - 1].id + 1;
      } else {
        input.id = 0;
      }

      // create new contact
      newContact = new Contact(input);

      // Add new contact to data structure array
      data.contacts.push(newContact);

      return newContact;
    },

    getContactById: function (id) {
      let found = null;

      // Loop through the contact list
      data.contacts.forEach(function (contact) {
        if (contact.id === id) {
          found = contact;
        }
      });

      return found;
    },

    updateContact: function (update) {
      let found = null;

      // Loop through the contact list
      data.contacts.forEach(function (contact) {
        if (contact.id === data.currentContact.id) {
          contact.firstName = update.firstName;
          contact.lastName = update.lastName;
          contact.email = update.email;
          contact.email2 = update.email2;
          contact.phone = update.phone;
          contact.phone2 = update.phone2;
          contact.address = update.address;
          contact.address2 = update.address2;
          contact.city = update.city;
          contact.state = update.state;
          contact.country = update.country;

          found = contact;
        }
      });

      return found;
    },

    deleteContact: function (id) {
      // Get ids
      ids = data.contacts.map(function (contact) {
        return contact.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.contacts.splice(index, 1);
    },

    clearAllContacts: function () {
      data.contacts = [];
      data.currentContact = null;
    },

    setCurrentContact: function (contact) {
      data.currentContact = contact;
    },

    getCurrentContact: function () {
      return data.currentContact;
    },

    logData: function () {
      return data;
    }
  };

})();

// UI Controller
const UICtrl = (function () {
  // UI selectors
  const UISelectors = {
    contactCount: '#contact-count',
    contactList: '#contactList',
    listContacts: '#contactList div',
    allContacts: '#contactList div.lightGrey',
    alert: '#alert',
    infoCard: '#info-card',
    clearBtn: '#clear-all',
    formTitle: '#form-title',
    addBtn: '.add-btn',
    deleteBtn: '.delete-btn',
    updateBtn: '.update-btn',
    backBtn: '.back-btn',
    idInput: '#id',
    firstNameInput: '#validationCustom01',
    lastNameInput: '#validationCustom02',
    emailInput: '#validationCustom03',
    emailInput2: '#validationCustom04',
    phoneInput: '#validationCustom05',
    phoneInput2: '#validationCustom06',
    addressInput: '#validationCustom07',
    addressInput2: '#validationCustom08',
    cityInput: '#validationCustom09',
    stateInput: '#validationCustom10',
    countryInput: '#validationCustom11',
    contactListHeader: '#contactListHeader',
    contactCard: '.contact-card',
    contactInfo: '.contact-info'
  };

  // Public methods
  return {
    populateContactList: function (contacts) {
      let html = ``;

      contacts.forEach(contact => {
        html += `<div class="card mb-1 lightGrey" id="contact-${contact.id}">
        <div class="card-body">
        <div class="card-title">
          <span class="h4">${contact.lastName} ${contact.firstName}</span>
          <span class="pull-right" id="contact-${contact.id}">
            <a href="#" class="h6 display-info text-primary card-link" data-id="${contact.id}">
              <i class=" display-info fa fa-plus"></i>
            </a>
            <a href="#" class="h6 edit text-primary card-link" data-id="${contact.id}" >
              <i class="edit-contact fa fa-pencil"></i>
            </a>
            <a href="#" class="h6 delete text-danger card-link" data-id="${contact.id}">
              <i class="delete-contact fa fa-remove"></i>
            </a>
          </span>
        </div>
          <div id="info-card-${contact.id}" class="card card-body" style="display:none">
            <div class="card-text">
                <span class="h6">Email:</span> ${contact.email}, ${contact.email2}
                <hr>
                <span class="h6"> Phone:</span> ${contact.phone}, ${ contact.phone2}
                <hr>
                <span class="h6">Address: </span>${contact.address}
                <hr>
                <span class="h6"> Address 2:</span> ${contact.address2}
                <hr>
                <span class="h6"> City:</span> ${contact.city}
                <hr>
                <span class="h6"> State:</span> ${contact.state}
                <hr>
                <span class="h6"> Country:</span> ${contact.country}
            </div>
            </div>
        </div>
      </div>`;
      });

      // Insert list items
      document.querySelector(UISelectors.contactList).innerHTML = html;

      // Update contact count
      this.updateContactsCount();
    },

    updateContactsCount: function () {
      // Get Contacts from Ls
      let contacts = ContactCtrl.getData();
      if (contacts.length !== 0) {
        document.querySelector(UISelectors.contactCount).innerText = contacts.length;
      } else {
        document.querySelector(UISelectors.contactCount).innerText = 0;
      }
    },
    getContactInput: function () {
      return {
        firstName: document.querySelector(UISelectors.firstNameInput).value,
        lastName: document.querySelector(UISelectors.lastNameInput).value,
        email: document.querySelector(UISelectors.emailInput).value,
        email2: document.querySelector(UISelectors.emailInput2).value,
        phone: document.querySelector(UISelectors.phoneInput).value,
        phone2: document.querySelector(UISelectors.phoneInput2).value,
        address: document.querySelector(UISelectors.addressInput).value,
        address2: document.querySelector(UISelectors.addressInput2).value,
        city: document.querySelector(UISelectors.cityInput).value,
        state: document.querySelector(UISelectors.stateInput).value,
        country: document.querySelector(UISelectors.countryInput).value
      };

    },

    showAlert: function (tagId, msg, className) {
      const alert = document.querySelector(`#${tagId}`);

      alert.className = "alert alert-danger";
      alert.innerText = msg;
    },

    clearAlert: function (tagId) {
      const alert = document.querySelector(`#${tagId}`);

      alert.className = "";
      alert.innerText = "";
    },

    // form controls
    validateForm: function () {
      const firstName = document.forms["contact-form"]["validationCustom01"];
      const lastName = document.forms["contact-form"]["validationCustom02"].value;
      const email1 = document.forms["contact-form"]["validationCustom03"].value;
      const phone1 = document.forms["contact-form"]["validationCustom05"].value;
      const address1 = document.forms["contact-form"]["validationCustom07"].value;
      const state = document.forms["contact-form"]["validationCustom10"].value;
      const country = document.forms["contact-form"]["validationCustom11"].value;

      if (firstName == "" || lastName === "" || email1 === "" || address1 === "" || phone1 === "" || state === "" || country === "") {
        this.showAlert('alert', 'Please fill all astericked (*) fields', 'alert alert-danger');

        return false;
      } else {
        this.clearAlert('alert');
        return true;
      }


    },

    hideContactListHeader: function () {
      document.querySelector(UISelectors.contactListHeader).style.display = 'none';
    },

    addContactList: function (contact) {
      document.querySelector(UISelectors.contactListHeader).style.display = 'block';
      // Create div element
      const div = document.createElement('div');
      // Add class and Id
      div.className = "card mb-1 contact-card lightGrey";
      div.id = `contact-${contact.id}`;

      // Add html
      div.innerHTML = `
      <div class="card-body ">
      <div class="card-title">
        <span class="h4">${contact.lastName} ${contact.firstName}</span>
        <span class="pull-right" id="contact-${contact.id}">
          <a href="#" class="h6 display-info text-primary card-link" data-id="${contact.id}">
            <i class="display-info fa fa-plus"></i>
          </a>
          <a href="#" class="h6 edit text-primary card-link" data-id="${contact.id}" >
            <i class="edit-contact fa fa-pencil"></i>
          </a>
          <a href="#" class="h6 delete text-danger card-link" data-id="${contact.id}">
            <i class="delete-contact fa fa-remove"></i>
          </a>
        </span>
      </div>
      <div id="info-card-${contact.id}" class="card card-body" style="display:none">
      <div class="card-text">
          <span class="h6">Email:</span> ${contact.email}, ${contact.email2}
          <hr>
          <span class="h6"> Phone:</span> ${contact.phone}, ${ contact.phone2}
          <hr>
          <span class="h6">Address: </span>${contact.address}
          <hr>
          <span class="h6"> Address 2:</span> ${contact.address2}
          <hr>
          <span class="h6"> City:</span> ${contact.city}
          <hr>
          <span class="h6"> State:</span> ${contact.state}
          <hr>
          <span class="h6"> Country:</span> ${contact.country}
      </div>
    </div>
  </div>`;

      // Insert item
      document.querySelector(UISelectors.contactList).insertAdjacentElement('beforeend', div);

    },

    updateContactList: function (contact) {
      let listContacts = document.querySelectorAll(UISelectors.listContacts);

      // Turn node list to array
      listContacts = Array.from(listContacts);

      listContacts.forEach(function (listContact) {
        const contactID = listContact.getAttribute('id');

        if (contactID === `contact-${contact.id}`) {
          document.querySelector(`#contact-${contact.id}`).innerHTML = `
          <div class="card-body ">
          <div class="card-title">
            <span class="h4">${contact.lastName} ${contact.firstName}</span>
            <span class="pull-right" id="contact-${contact.id}">
              <a href="#" class="h6 display-info text-primary card-link" data-id="${contact.id}">
                <i class="display-info fa fa-plus"></i>
              </a>
              <a href="#" class="h6 edit text-primary card-link" data-id="${contact.id}" >
                <i class="edit-contact fa fa-pencil"></i>
              </a>
              <a href="#" class="h6 delete text-danger card-link" data-id="${contact.id}">
                <i class="delete-contact fa fa-remove"></i>
              </a>
            </span>
          </div>
          <div id="info-card-${contact.id}" class="card card-body" style="display:none">
          <div class="card-text">
              <span class="h6">Email:</span> ${contact.email}, ${contact.email2}
              <hr>
              <span class="h6"> Phone:</span> ${contact.phone}, ${ contact.phone2}
              <hr>
              <span class="h6">Address: </span>${contact.address}
              <hr>
              <span class="h6"> Address 2:</span> ${contact.address2}
              <hr>
              <span class="h6"> City:</span> ${contact.city}
              <hr>
              <span class="h6"> State:</span> ${contact.state}
              <hr>
              <span class="h6"> Country:</span> ${contact.country}
          </div>
          </div>
        </div>
          `;
        }
      });

      // Clear Edit State
      UICtrl.clearEditState();
    },

    deleteContact: function (id) {
      const contactID = `#contact-${id}`;
      const contact = document.querySelector(contactID);
      contact.remove();

      // hide contact list header
      let listContacts = document.querySelectorAll(UISelectors.listContacts);

      // Turn node list to array
      listContacts = Array.from(listContacts);
      if (listContacts.length === 0) {
        UICtrl.hideContactListHeader();
        // Disable clear btn    
        document.querySelector(UISelectors.clearBtn).className = "btn btn-lg btn-secondary rounded-0 box-shadow disabled";
      }
    },

    clearContactList: function () {
      document.querySelector(UISelectors.contactList).innerHTML = '';

      UICtrl.hideContactListHeader();
    },

    clearInput: function () {

      document.querySelector(UISelectors.firstNameInput).value = '';
      document.querySelector(UISelectors.lastNameInput).value = '';
      document.querySelector(UISelectors.emailInput).value = '';
      document.querySelector(UISelectors.emailInput2).value = '';
      document.querySelector(UISelectors.phoneInput).value = '';
      document.querySelector(UISelectors.phoneInput2).value = '';
      document.querySelector(UISelectors.addressInput).value = '';
      document.querySelector(UISelectors.addressInput2).value = '';
      document.querySelector(UISelectors.cityInput).value = '';
      document.querySelector(UISelectors.stateInput).value = '';
      document.querySelector(UISelectors.countryInput).value = '';
    },

    clearEditState: function () {
      // Change form Title
      document.querySelector(UISelectors.formTitle).innerText = 'Add New Contact';
      // Change buttons state
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';

      // Enable clear btn 
      if (ContactCtrl.getData().length !== 0) {
        document.querySelector(UISelectors.clearBtn).className = "btn btn-lg btn-secondary rounded-0 box-shadow";
      }
    },
    showEditState: function () {
      // Change form Title
      document.querySelector(UISelectors.formTitle).innerText = 'Edit Contact';
      // Change buttons state
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },

    addContactToForm: function () {
      document.querySelector(UISelectors.firstNameInput).value = ContactCtrl.getCurrentContact().firstName;
      document.querySelector(UISelectors.lastNameInput).value = ContactCtrl.getCurrentContact().lastName;
      document.querySelector(UISelectors.emailInput).value = ContactCtrl.getCurrentContact().email;
      document.querySelector(UISelectors.emailInput2).value = ContactCtrl.getCurrentContact().email2;
      document.querySelector(UISelectors.phoneInput).value = ContactCtrl.getCurrentContact().phone;
      document.querySelector(UISelectors.phoneInput2).value = ContactCtrl.getCurrentContact().phone2;
      document.querySelector(UISelectors.addressInput).value = ContactCtrl.getCurrentContact().address;
      document.querySelector(UISelectors.addressInput2).value = ContactCtrl.getCurrentContact().address2;
      document.querySelector(UISelectors.cityInput).value = ContactCtrl.getCurrentContact().city;
      document.querySelector(UISelectors.stateInput).value = ContactCtrl.getCurrentContact().state;
      document.querySelector(UISelectors.countryInput).value = ContactCtrl.getCurrentContact().country;

      UICtrl.showEditState();
    },

    formAlerts: function (tagId, newClassName, display) {
      let invalidFeedbacks = document.querySelectorAll(`#${tagId}`);

      invalidFeedbacks = Array.from(invalidFeedbacks);

      invalidFeedbacks.forEach(invalidFeedback => {
        const input = invalidFeedback.parentElement.firstElementChild.nextElementSibling;
        if (input.value === "") {

          input.className = newClassName;
          invalidFeedback.style.display = display;
        } else {
          input.className = newClassName;
          invalidFeedback.style.display = 'none';
        }
      });
    },

    getSelectors: function () {
      return UISelectors;
    }

  };
})();

// App Controller
const AppCtrl = (function (StorageCtrl, ContactCtrl, UICtrl) {

  // Load Event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add contact events
    document.querySelector(UISelectors.addBtn).addEventListener('click', contactAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Display contact info events
    document.querySelector(UISelectors.contactList).addEventListener('click', displayInfo);

    // Edit contact info events
    document.querySelector(UISelectors.contactList).addEventListener('click', editContact);

    // Delete contact from list events
    document.querySelector(UISelectors.contactList).addEventListener('click', delContact);

    // Update contact info events
    document.querySelector(UISelectors.updateBtn).addEventListener('click', UpdateContactSubmit);

    // Delete contact info events
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteContactSubmit);

    // back btn events
    document.querySelector(UISelectors.backBtn).addEventListener('click', backBtnSubmit);

    // Clear-all btn event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllContactClick);
  };

  // Add contact on Submit
  const contactAddSubmit = function (e) {
    const UISelectors = UICtrl.getSelectors();

    // validate Form
    if (UICtrl.validateForm() !== false) {
      // Clear Alert
      UICtrl.clearAlert('alert');
      UICtrl.formAlerts('invalidFeedback', 'form-control', 'none');

      // Add new Contact to data structure
      const input = UICtrl.getContactInput();
      const newContact = ContactCtrl.addContact(input);

      // Store in localStorage
      StorageCtrl.storeContact(newContact);

      // Add new Contact to UI
      //UICtrl.addContactList(newContact);
      // Get all contacts
      contacts = StorageCtrl.getContactFromLs();
        // show contact list header
        document.querySelector(UISelectors.contactListHeader).style.display = 'block';
        // Populate contact List
        UICtrl.populateContactList(contacts);
        UICtrl.updateContactsCount();

      

      // Clear Input fields
      UICtrl.clearInput();

      // Enable clear btn    
      document.querySelector(UISelectors.clearBtn).className = "btn btn-lg btn-secondary rounded-0 box-shadow";

    } else {
      UICtrl.formAlerts('invalidFeedback', 'form-control border-danger', 'inline');
    }

    e.preventDefault();
  };


  // Display contact info
  const displayInfo = function (e) {
    const UISelectors = UICtrl.getSelectors();

    if (e.target.parentElement.classList.contains('display-info')) {
      // change icon
      if (e.target.classList.contains('fa-plus')) {
        e.target.className = "display-info fa fa-minus";
      } else if (e.target.classList.contains('fa-minus')) {
        e.target.className = "display-info fa fa-plus";
      }
      // Get all contact on list
      let allContactsCard = document.querySelectorAll(UISelectors.allContacts);

      // convert to array
      allContactsCard = Array.from(allContactsCard);

      const contactId = e.target.parentNode.parentNode.id;
      //console.log(contactId);

      // Break into an array
      const contactIdArr = contactId.split('-');

      // Get the actual id
      const id = parseInt(contactIdArr[1]);

      // Get contact
      const contactInfoToDisplay = ContactCtrl.getContactById(id);

      // Set current contact
      ContactCtrl.setCurrentContact(contactInfoToDisplay);

      // Get current contact
      const currentContact = ContactCtrl.getCurrentContact();
      //console.log(currentContact);

      allContactsCard.forEach(contactCard => {
        const infoCard = contactCard.firstElementChild.lastElementChild;
        if (infoCard.getAttribute('id') === `info-card-${currentContact.id}` && infoCard.style.display === "none") {
          // Display contact info
          infoCard.style.display = "block";
        } else if (infoCard.getAttribute('id') === `info-card-${currentContact.id}` && infoCard.style.display === "block") {
          // Hide contact info
          infoCard.style.display = "none";
        } else if (infoCard.getAttribute('id') !== `info-card-${currentContact.id}` && infoCard.style.display === "block") {
          // Hide contact info
          infoCard.style.display = "none";
          // Get display icon
          const icon = contactCard.firstElementChild.firstElementChild.lastElementChild.firstElementChild.firstElementChild;
          // Change display icon
          if (icon.classList.contains('fa-minus')) {
            icon.className = "display-info fa fa-plus";
          }
        }
      });
    }

    e.preventDefault();
  };

  // Edit contact on click
  const editContact = function (e) {

    if (e.target.classList.contains('edit-contact')) {
      if (ContactCtrl.getCurrentContact() !== null) {
        // Show removed icon
        let listContacts = document.querySelectorAll(UICtrl.getSelectors().listContacts);

        // Turn node list to array
        listContacts = Array.from(listContacts);

        listContacts.forEach(function (listContact) {
          const contactID = listContact.getAttribute('id');

          if (contactID === `contact-${ContactCtrl.getCurrentContact().id}`) {
            // Get the remove icon
            const parentElement = listContact.firstElementChild.firstElementChild.children[1];
            // Show remove icon
            parentElement.lastElementChild.style.display = 'inline';
          }
        });
      }
      // Disable clear-all   
      document.querySelector(UICtrl.getSelectors().clearBtn).className = "btn btn-lg btn-secondary rounded-0 box-shadow disabled";

      // Get contact id
      const contactId = e.target.parentNode.parentNode.id;

      // Break into an array
      const contactIdArr = contactId.split('-');

      // Get the actual id
      const id = parseInt(contactIdArr[1]);

      // Get contact
      const contactToEdit = ContactCtrl.getContactById(id);

      // Set current contact
      ContactCtrl.setCurrentContact(contactToEdit);

      // Hide remove icon
      const removeIcon = e.target.parentNode.nextElementSibling;


      const currentContact = ContactCtrl.getCurrentContact();
      const removeIconId = parseInt(removeIcon.getAttribute('data-id'));
      if (removeIconId === currentContact.id) {
        removeIcon.style.display = 'none';
      }

      // Add contact to form
      UICtrl.addContactToForm();
    }


    e.preventDefault();
  };


  // Update contact on submit
  const UpdateContactSubmit = function (e) {
    // validate Form
    if (UICtrl.validateForm() !== false) { // Clear Alert
      UICtrl.clearAlert('alert');
      UICtrl.formAlerts('invalidFeedback', 'form-control', 'none');

      // Get contact input
      const contact = UICtrl.getContactInput();

      // Update contact
      const updatedContact = ContactCtrl.updateContact(contact);

      // Update UI
      UICtrl.updateContactList(updatedContact);

      // Update Ls
      StorageCtrl.updateContactFromLs(updatedContact);
    } else {
      UICtrl.formAlerts('invalidFeedback', 'form-control border-danger', 'inline');
    }

    e.preventDefault();
  };

  // Delete contact on submit
  const deleteContactSubmit = function (e) {
    // Get current contact
    const currentContact = ContactCtrl.getCurrentContact();

    // Delete from data structure
    ContactCtrl.deleteContact(currentContact.id);

    // Delete from UI
    UICtrl.deleteContact(currentContact.id);
    UICtrl.updateContactsCount();

    //Delete from Ls
    StorageCtrl.deleteContactFromLs(currentContact.id);

    // Clear Edit State
    UICtrl.clearEditState();


    e.preventDefault();
  };

  // Delete contact from display list
  const delContact = function (e) {
    if (e.target.classList.contains('delete-contact')) {
      // Get contact id
      const contactId = e.target.parentNode.parentNode.id;

      // Break into an array
      const contactIdArr = contactId.split('-');

      // Get the actual id
      const id = parseInt(contactIdArr[1]);

      // Get contact
      const contactToDelete = ContactCtrl.getContactById(id);

      // Delete from data structure
      ContactCtrl.deleteContact(contactToDelete.id);

      // Delete from UI
      UICtrl.deleteContact(contactToDelete.id);
      UICtrl.updateContactsCount();

      // Delete from Ls
      StorageCtrl.deleteContactFromLs(contactToDelete.id);
    }
    e.preventDefault();
  };

  const backBtnSubmit = function (e) {

    UICtrl.clearEditState();
    // Show remove icon
    let listContacts = document.querySelectorAll(UICtrl.getSelectors().listContacts);

    // Turn node list to array
    listContacts = Array.from(listContacts);

    listContacts.forEach(function (listContact) {
      const contactID = listContact.getAttribute('id');

      if (contactID === `contact-${ContactCtrl.getCurrentContact().id}`) {
        // Get the remove icon
        const parentElement = listContact.firstElementChild.firstElementChild.children[1];
        // Show remove icon
        parentElement.lastElementChild.style.display = 'inline';
      }
    });

    e.preventDefault();
  };

  const clearAllContactClick = function () {
    // Delete all contacts from data structure
    ContactCtrl.clearAllContacts();

    // Clear all contacts from UI
    UICtrl.clearContactList();

    // Clear all contacts from Ls
    StorageCtrl.clearAllContactsFromLs();

    // Update contacts counter
    UICtrl.updateContactsCount();

    // Disable clear-all btn
    document.querySelector(UICtrl.getSelectors().clearBtn).className = "btn btn-lg btn-secondary rounded-0 box-shadow disabled";

  };





  // Public methods
  return {

    init: function () {
      // Set Initial state
      UICtrl.clearEditState();

      // Fetch contacts from data structure
      const contacts = ContactCtrl.getData();

      // hide contact list header
      if (contacts.length === 0) {
        UICtrl.hideContactListHeader();
      } else {
        // Populate UI with contacts
        UICtrl.populateContactList(contacts);

        // Enable clear-all button
        document.querySelector(UICtrl.getSelectors().clearBtn).className = "btn btn-lg btn-secondary rounded-0 box-shadow";
      }

      // Load EventListners
      loadEventListeners();

    }
  };



})(StorageCtrl, ContactCtrl, UICtrl);


// Initialize App
AppCtrl.init();