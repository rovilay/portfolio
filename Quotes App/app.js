/**
 * Styles for Quote app
 *
 * @version 1.0.0
 * @author Ogooluwa Akinola
 * 
 **/

const UISelector = {
  form: '#quote-form',
  authorInput: "#author",
  quoteInput: "#quote",
  changeQuote: "#change-quote",
  displayQuote: "#display-quote",
  clearQuote: "#clear-quote",
  alert: "#alert",
  addBtn: "#add-btn",
  deleteBtn: "#delete-btn",
  updateBtn: "#update-btn",
  backBtn: "#back-btn",
  formTitle: "#form-title"
};

// Store quote in local storage
const storeQuoteInLs = function (quote) {
  localStorage.setItem('Quotes', JSON.stringify(quote));
};

// Get quotes from local storage
const getQuotesFromLs = function () {
  if (localStorage.getItem('Quotes') !== null) {
    return JSON.parse(localStorage.getItem('Quotes'));
  } else {
    return [];
  }
};

// Clear quotes from local storage
const clearQuoteFromLs = function () {
  if (localStorage.getItem('Quotes') !== null) {
    localStorage.removeItem('Quotes');
  }
};

// Display alert
const showAlert = function (tagId, msg, newClassName) {
  const alert = document.querySelector(UISelector.alert);

  alert.className = newClassName;
  alert.innerText = msg;

};

// Clear alert after 3 seconds
const clearAlert = function (tagId) {
  const alert = document.querySelector(`#${tagId}`);
  setTimeout(function () {
    alert.className = "";
    alert.innerText = "";
  }, 3000);

};

// Initialize Array of Quotes
let quoteArray = getQuotesFromLs();

// Initialize current Quotes

const getQuoteById = function (id) {
  let currentQuote;
  quoteArray.forEach(quote => {
    let quoteId = parseInt(quote.id);
    if (id === quoteId) {
      currentQuote = quote;
    }
  });
  return currentQuote;
};

// Get quotes from form
const getQuotesFromForm = function () {
  const author = document.querySelector(UISelector.authorInput).value;
  const quote = document.querySelector(UISelector.quoteInput).value;

  return {
    author,
    quote,
  };
};

// Clear Form input
const clearFormInput = function () {
  document.querySelector(UISelector.authorInput).value = '';
  document.querySelector(UISelector.quoteInput).value = '';
};

const showEditState = function () {
  // Change form Title
  document.querySelector(UISelector.formTitle).innerText = 'Edit Quote';
  // Change buttons state
  document.querySelector(UISelector.addBtn).style.display = 'none';
  document.querySelector(UISelector.updateBtn).style.display = 'inline';
  document.querySelector(UISelector.deleteBtn).style.display = 'inline';
  document.querySelector(UISelector.backBtn).style.display = 'inline';
};

const clearEditState = function () {
  // Change form Title
  document.querySelector(UISelector.formTitle).innerText = 'Add Quote';
  // Change buttons state
  document.querySelector(UISelector.addBtn).style.display = 'inline';
  document.querySelector(UISelector.updateBtn).style.display = 'none';
  document.querySelector(UISelector.deleteBtn).style.display = 'none';
  document.querySelector(UISelector.backBtn).style.display = 'none';
};

const getCurrentQuoteOnDisplay = function () {
  const currentQuoteId = document.querySelector(UISelector.displayQuote).firstElementChild.getAttribute('id');

  const Id = parseInt(currentQuoteId.split('-')[1]);
  const currentQuoteOnDisplay = getQuoteById(Id);

  return currentQuoteOnDisplay;
};

const addQuoteToForm = function () {
  // Add author to form
  document.querySelector(UISelector.authorInput).value = getCurrentQuoteOnDisplay().author;

  // Add quote to form
  document.querySelector(UISelector.quoteInput).value = getCurrentQuoteOnDisplay().quote;

  // Show edit state
  showEditState();
};

// Add Quote on submit
const addQuoteSubmit = function (e) {
  const formQuote = getQuotesFromForm();
  if (formQuote.quote === "" || formQuote.author === "") {
    showAlert('alert', 'Please Fill All Fields', 'alert alert-danger mt-3');
    e.preventDefault();
  } else {
    // add id to quotes
    if (quoteArray.length > 0) {
      formQuote.id = quoteArray[quoteArray.length - 1].id + 1;
    } else {
      formQuote.id = 0;
    }

    quoteArray.push(formQuote);
    storeQuoteInLs(quoteArray);

    showAlert('alert', 'Quote Added!', 'alert alert-success mt-3');
    clearFormInput();

    changeQuoteImgOnDisplay();

    e.preventDefault();
  }

  clearAlert('alert');
};

// Update quote
const updateQuoteSubmit = function (e) {
  const formQuote = getQuotesFromForm();
  // Check if form is empty
  if (formQuote.quote === "" || formQuote.author === "") {
    showAlert('alert', 'Please Fill All Fields', 'alert alert-danger mt-3');

    e.preventDefault();

  } else {
    const quoteToUpdateId = parseInt(getCurrentQuoteOnDisplay().id);
    quoteArray.forEach((quote, index) => {
      if (quoteToUpdateId === parseInt(quote.id)) {
        formQuote.id = quote.id;
        quoteArray.splice(index, 1, formQuote);
        e.preventDefault();
      }
    });

    storeQuoteInLs(quoteArray);

    showAlert('alert', 'Quote Updated!', 'alert alert-success mt-3');
    clearFormInput();
    clearEditState();

    changeQuoteImgOnDisplay();
  }

  clearAlert('alert');
};

// delete quote
const deleteQuoteSubmit = function (e) {
  if (quoteArray.length === 1) {
    const confirmDeleteAll = confirm('You have only ONE quote. Are you sure you want to DELETE?');
    if (confirmDeleteAll) {
      clearAllQuote();
      clearFormInput();
      showAlert('alert', 'Quote Deleted!', 'alert alert-warning mt-3');
      clearAlert('alert');
    }
  } else {
    const formQuote = getQuotesFromForm();
    const quoteToDeleteId = parseInt(getCurrentQuoteOnDisplay().id);
    quoteArray.forEach((quote, index) => {
      if (quoteToDeleteId === parseInt(quote.id)) {
        quoteArray.splice(index, 1);
      }
    });

    storeQuoteInLs(quoteArray);

    showAlert('alert', 'Quote Deleted!', 'alert alert-warning mt-3');
    clearFormInput();
    clearEditState();

    changeQuoteImgOnDisplay();
    clearAlert('alert');
  }

  e.preventDefault();
};

// back btn
const backBtnSubmit = function (e) {
  clearFormInput();
  clearEditState();


  e.preventDefault();
};


// Clear all quotes
const clearAllQuote = function (msg = 'Are you sure you want to CLEAR ALL QUOTES?') {
  clearQuoteFromLs();
  quoteArray = getQuotesFromLs();
  if (quoteArray.length === 0) {
    document.querySelector(UISelector.displayQuote).innerHTML = '';

    // Disable buttons
    const clrBtns = document.querySelectorAll(UISelector.clearQuote);
    const changeBtns = document.querySelectorAll(UISelector.changeQuote);

    clrBtns.forEach(clrBtn => {
      if (!clrBtn.classList.contains('disabled')) {
        clrBtn.className = "btn  btn-secondary btn-md rounded-0 box-shadow disabled";
      }
    });

    changeBtns.forEach(changeBtn => {
      if (!changeBtn.classList.contains('disabled')) {
        changeBtn.className = "btn  btn-secondary btn-md rounded-0 box-shadow disabled";
      }
    });

    clearEditState();
  }
  // Scroll to top
  window.scrollTo(0, 0);
};

// Change quotes and image displayed
const changeQuoteImgOnDisplay = function () {
  // Change image
  const randomNum = Math.floor((Math.random() * 31) + 1);
  document.getElementsByTagName('section')[0].style.background = `linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 2.75)
  ),
  url('http://res.cloudinary.com/dcqnswemi/image/upload/v1521401342/img0${randomNum}.jpg') no-repeat center center fixed`;

  // Change quote
  const len = quoteArray.length;
  const randomNumber = Math.floor((Math.random() * len));

  const currentQuote = quoteArray[randomNumber];
  if (len > 0) {
    // Enable buttons
    const clrBtns = document.querySelectorAll(UISelector.clearQuote);
    const changeBtns = document.querySelectorAll(UISelector.changeQuote);

    clrBtns.forEach(clrBtn => {
      if (clrBtn.classList.contains('disabled')) {
        clrBtn.className = "btn  btn-secondary btn-md rounded-0 box-shadow smallText";
      }
    });

    changeBtns.forEach(changeBtn => {
      if (changeBtn.classList.contains('disabled') && len > 1) {
        changeBtn.className = "btn  btn-secondary btn-md rounded-0 box-shadow smallText";
      }
    });


    let html = `
    <div id="quote-${currentQuote.id}" class="card card-body bg-transparent mt-4">
      <blockquote class="blockquote text-center text-white">
        <p class="mb-0 display-md-4 display-sm-4 tool-tip">"${currentQuote.quote}"</p>
        <footer class="blockquote-footer text-white"><cite title="Source Title">${currentQuote.author}</cite></footer>
      </blockquote>
    </div>
  `;

    document.querySelector(UISelector.displayQuote).innerHTML = html;

    // Scroll to quotes
    setTimeout(function () {
      window.scrollTo(0, 300);
    }, 1);

  }
};

// Disable submit on enter
document.addEventListener('keypress', function (e) {
  if (e.keyCode === 13 || e.which === 13) {
    e.preventDefault();
    return false;
  }
});

// Edit quote
const editQuote = function () {
  // Add quote to form
  addQuoteToForm();

  // Show edit state
  showEditState();
};


// Form events
document.querySelector(UISelector.addBtn).addEventListener('click', addQuoteSubmit);

document.querySelector(UISelector.updateBtn).addEventListener('click', updateQuoteSubmit);

document.querySelector(UISelector.deleteBtn).addEventListener('click', deleteQuoteSubmit);

document.querySelector(UISelector.backBtn).addEventListener('click', backBtnSubmit);

// Change Quote button event
document.querySelectorAll(UISelector.changeQuote).forEach(changeBtn => {
  changeBtn.addEventListener('click', function (e) {
    if (!e.target.parentElement.classList.contains('disabled')) {
      changeQuoteImgOnDisplay();
    }
    e.preventDefault();
  });
});

// Clear All Quotes button event
document.querySelectorAll(UISelector.clearQuote).forEach(clrBtn => {
  clrBtn.addEventListener('click', function (e) {
    if (!e.target.parentElement.classList.contains('disabled')) {
      const confirmClearAll = confirm("Are you sure you want to CLEAR ALL QUOTES?");
      if (confirmClearAll) {
        clearAllQuote();
        showAlert('alert', 'All Quotes Cleared!', 'alert alert-warning mt-3');
        clearAlert('alert');
      }
    }
    e.preventDefault();
  });
});



// Window event onload
window.addEventListener('load', function () {

  // Clear Edit state
  clearEditState();

  // Quote display event
  document.querySelector(UISelector.displayQuote).addEventListener('click', function () {
    editQuote();
    // Scroll to top
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 1);
  });

  // Change quote and image on display
  changeQuoteImgOnDisplay();
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});