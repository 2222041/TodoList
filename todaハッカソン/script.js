'use strict';

const storage = localStorage;

const table = document.getElementById('dotable');
const todo = document.getElementById('todo');
const priority = document.querySelector('select');
const deadline = document.querySelector('input[type="date"]');
const submit = document.getElementById('submit');
const repair = document.getElementById('repair');
const filterButton = document.getElementById('priority');
const sortdayButton = document.getElementById('sortdayButton');
const sortButton = document.getElementById('sortButton');
const remove = document.getElementById('remove');
const deletebutton = document.getElementById('deletebutton');
const main = document.querySelector('main');

//空のリストを作成
let list = [];
let finish_list = [];

//前回のローカルストレージを読み込む
document.addEventListener('DOMContentLoaded', () => {
  // 1. ストレージデータ（JSON）の読み込み
  const json = storage.todoList;
  if (json == undefined) {
    clearTable();
    return;
  }
  list = JSON.parse(json);
  clearTable();
  for (const item of list) {
    addItem(item);
  }
  const json_f = storage.tofinishList;
  if (json_f == undefined) {
    clearTable_f();
    return;
  }
  finish_list = JSON.parse(json_f);
  clearTable_f();
  for (const item_f of finish_list) {
    addItem_f(item_f);
  }
});

//チェックボックスを作成する
const addItem = (item) => {
  const tr = document.createElement('tr');

  for (const prop in item) {
    const td = document.createElement('td');
    if (prop == 'done') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener('change', checkBoxListener);
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }

  table.append(tr);
};

const addItem_f = (item_f) => {
  const tr = document.createElement('tr');

  for (const prop in item_f) {
    const td = document.createElement('td');
    if (prop == 'done') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item_f[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener('change', checkBoxListener_f);
    } else {
      td.textContent = item_f[prop];
    }
    tr.appendChild(td);
  }

  document.getElementById('finishtable').append(tr);
};

const checkBoxListener = (ev) => {
  // 1-1. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementById('dotable').getElementsByTagName('tr'));
  // 1-2. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev.currentTarget.parentElement.parentElement;
  // 1-3. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;
  // 2. 配列listにそのインデックスでアクセスしてdoneを更新
  list[idx].done = ev.currentTarget.checked;
  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
};

const checkBoxListener_f = (ev_f) => {
  // 1-1. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementById('finishtable').getElementsByTagName('tr'));
  // 1-2. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev_f.currentTarget.parentElement.parentElement;
  // 1-3. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;
  // 2. 配列listにそのインデックスでアクセスしてdoneを更新
  finish_list[idx].done = ev_f.currentTarget.checked;
  // 3. ストレージデータを更新
  storage.tofinishList = JSON.stringify(finish_list);
};

//TODOを登録する
submit.addEventListener('click', () => {
  const item = {};

  if (todo.value != '') {
    item.todo = todo.value;
  } else {
    window.alert('TODOを入力してください');
    return;
  }
  item.priority = priority.value;
  //const date = new Date();
  const date = new Date();
  item.day = date.toLocaleString().slice(0, 25);//item.day.length - 15, item.day.length);
  //item.time = date.toLocaleTimeString();
  if (deadline.value != '') {
    item.deadline = deadline.value;
  } else {
    window.alert('期日を入力してください');
    return;
  }
  item.done = false;

  todo.value = '';
  priority.value = '普';
  deadline.value = '';

  addItem(item);

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

//優先度でソートする
filterButton.addEventListener('click', () => {
  clearTable();
  list = list.filter((item) => item.priority == '高').concat(list.filter((item) => item.priority != '高'));
  list = list.filter((item) => item.priority != '低').concat(list.filter((item) => item.priority == '低'));
  for (const item of list) {
    addItem(item);
  }
  storage.todoList = JSON.stringify(list);
});

//作成日時でソートする
sortdayButton.addEventListener('click', () => {
  clearTable();
  // table要素を指定する
  list.sort((a, b) => {
    const dateA = new Date(a.day);
    const dateB = new Date(b.day);
    return dateA - dateB;
  });
  for (const item of list) {
    addItem(item);
  }
  storage.todoList = JSON.stringify(list);
});

//期日でソートする
sortButton.addEventListener('click', () => {
  clearTable();
  // table要素を指定する
  list.sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);
    return dateA - dateB;
  });
  for (const item of list) {
    addItem(item);
  }
  storage.todoList = JSON.stringify(list);
});

//完了、未完了のテーブルの削除
const clearTable = () => {
  const trList = Array.from(document.getElementById('dotable').getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};
const clearTable_f = () => {
  const trList = Array.from(document.getElementById('finishtable').getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

//削除のボタンを作成
remove.addEventListener('click', () => {
  clearTable();
  clearTable_f();
  // 1. 未完了のTODOを抽出して定数listを置き換え
  finish_list = list.filter((item) => item.done == true).concat(finish_list);
  if (finish_list.length >= 9) {
    finish_list = finish_list.slice(0, 10)
  }
  for (const item_f of finish_list) {
    addItem_f(item_f);
  }
  storage.tofinishList = JSON.stringify(finish_list);

  list = list.filter((item) => item.done == false);
  // 2. TODOデータをテーブルに追加
  for (const item of list) {
    addItem(item);
  }

  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
});

//復元のボタンを作成
repair.addEventListener('click', () => {
  clearTable();
  clearTable_f();
  // 1. 未完了のTODOを抽出して定数listを置き換え
  list = list.concat(finish_list.filter((item_f) => item_f.done == false));
  finish_list = finish_list.filter((item_f) => item_f.done == true);
  for (const item_f of finish_list) {
    addItem_f(item_f);
  }
  storage.tofinishList = JSON.stringify(finish_list);
  // 2. TODOデータをテーブルに追加
  for (const item of list) {
    addItem(item);
  }
  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
});

//完全削除のボタンを作成
deletebutton.addEventListener('click', () => {
  clearTable_f();
  finish_list = finish_list.filter((item_f) => item_f.done == false);
  for (const item_f of finish_list) {
    addItem_f(item_f);
  }
  storage.tofinishList = JSON.stringify(finish_list);
});