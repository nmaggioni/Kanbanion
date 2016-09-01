/* eslint-env browser,jquery  */

const remote = require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = require('fs');
let currentFile = null;
const Menu = remote.Menu;
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click () {
          save(currentFile);
        }
      },
      {
        label: 'Save as...',
        accelerator: 'CmdOrCtrl+Shift+S',
        click () {
          save();
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click () {
          open();
        }
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click () {
          dialog.showMessageBox({
            type: 'question',
            buttons: ['Yes', 'No'],
            defaultId: 0,
            title: 'Quit',
            message: 'Do you want to save the changes?',
            detail: 'Your work may be lost.',
            cancelId: -1,
          }, (res) => {
            if (res !== 0) {
              return app.quit();
            }
            save(currentFile, app.quit);
          });
        }
      }
    ]
  },
  {
    label: 'About',
    submenu: [
      {
        label: 'Info',
        accelerator: 'CmdOrCtrl+I',
        click () {
          $('#about').dialog({
            hide: { effect: 'fadeOut', duration: 500 },
            show: { effect: 'fadeIn', duration: 250 },
            width: 380
          });
          $('.ui-dialog-titlebar-close').focus();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);


function save(file, callback) {
  if (file) {
    return writeFile(file);
  }

  dialog.showSaveDialog({
    defaultPath: app.getPath('userData'),
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile', 'createDirectory']
  }, (fileName) => {
    if (!fileName) {
      return;
    }
    writeFile(fileName);
  });

  function writeFile(file) {  //eslint-disable-line require-jsdoc
    fs.writeFile(file, cardsToJSON(), (err) => {
      if (err) {
        dialog.showErrorBox('Save error',
          'An error ocurred while saving the file: ' + err.message + '\n\n' + 'Check the console for more details.');
        console.log(err);  //eslint-disable-line no-console
        return;
      }
      currentFile = file;
      if (callback) return callback();
    });
  }
}

(()=> {
  setTimeout(() => {
    dontChangeMe !== Math.PI ? $('html').hide().html('<div' +  //eslint-disable-line no-undef
      ' style="display:flex;justify-content:center;' +
      'align-items:center;font-size:500px;">ಠ_ಠ</div>')
      .fadeIn(1000) : null;
  }, 1500);
})();

function cardsToJSON() {
  let cards = {};
  $('.card').each(function() {
    let category = $(this).parent().attr('id').replace('cards-', '').replace('-', '');
    if (!cards[category]) cards[category] = [];
    cards[category].push({
      title: $(this).find('.title').find('textarea').val(),
      description: $(this).find('.description').find('textarea').val(),
      dueDate: $(this).find('.due-date').find('input').val()
    });
  });
  return JSON.stringify(cards, null, 2);
}

function open(callback) {
  dialog.showOpenDialog({
    defaultPath: app.getPath('userData'),
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }, (fileNames) => {
    if (!fileNames) {
      return;
    }
    readFile(fileNames[0]);
  });

  function readFile(file) {  //eslint-disable-line require-jsdoc
    fs.readFile(file, 'utf-8', function(err, data) {
      if (err) {
        dialog.showErrorBox('Save error',
          'An error ocurred while opening the file: ' + err.message + '\n\n' + 'Check the console for more details.');
        console.log(err);  //eslint-disable-line no-console
        return;
      }
      JSONToCards(data);
      currentFile = file;
      if (callback) return callback();
    });
  }
}

function JSONToCards(cards) {
  function loadCard(cardData, container) {  //eslint-disable-line require-jsdoc
    $.get('card.html', (data) => {
      let $data = $(data);
      $data.find('.title').find('textarea').val(cardData.title);
      $data.find('.description').find('textarea').val(cardData.description);
      $data.find('.due-date').find('input').val(cardData.duedate);
      container.append($data);
      updateHandlers();  //eslint-disable-line no-undef
      recolorCards();  //eslint-disable-line no-undef
    });
  }

  $('.card').remove();
  cards = JSON.parse(cards);
  for (let categoryName in cards) {
    if (cards.hasOwnProperty(categoryName)) {
      let container = $('#cards-' + categoryName);
      let category = cards[categoryName];
      for (let i = 0; i < category.length; ++i) {
        loadCard(category[i], container);
      }
    }
  }
}
