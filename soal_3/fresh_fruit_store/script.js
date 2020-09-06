// data user
let dbUser = [
  {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    keranjang: [],
  },
  {
    username: 'ade',
    email: 'ade@gmail.com',
    password: 'ade123',
    role: 'user',
    keranjang: [],
  },
  {
    username: 'zahra',
    email: 'zahra@gmail.com',
    password: 'zahra123',
    role: 'user',
    keranjang: [],
  },
];

let dbProduk = [
  {
    idProduk: 1,
    nama: 'Mangga',
    foto:
      'https://fitshop-production.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2020/06/30222008/Mangga-Indramayu.jpg',
    desk: 'Lorem ipsum',
    stock: 5,
    price: 20000,
  },
  {
    idProduk: 2,
    nama: 'Apel',
    foto: 'https://doktersehat.com/wp-content/uploads/2014/05/apel.jpg',
    desk: 'Lorem ipsum',
    stock: 7,
    price: 50000,
  },
  {
    idProduk: 3,
    nama: 'Jeruk',
    foto:
      'https://static.republika.co.id/uploads/images/inpicture_slide/buah-jeruk-_180709133955-829.jpg',
    desk: 'Lorem ipsum ipsum',
    stock: 10,
    price: 70000,
  },
  {
    idProduk: 4,
    nama: 'Semangka',
    foto:
      'https://www.sahabatnestle.co.id/uploads/media/article/0001/03/thumb_2377_article_image_723x480.jpeg',
    desk: 'Lorem ipsum',
    stock: 20,
    price: 100000,
  },
];

let dbKeranjang = [];

// display homepage
document.getElementById('regis-page').style.display = 'none';
document.getElementById('login-page').style.display = 'none';
document.getElementById('list-produk').style.display = 'none';
document.getElementById('addProduct-page').style.display = 'none';
document.getElementById('cart-page').style.display = 'none';
document.getElementById('order-page').style.display = 'none';

// variabel global
let userLogin = null;
let totalBayar;

document.getElementById('bt-logout').disabled = true;

// class user
class DB_User {
  constructor(_username, _email, _password) {
    this.username = _username;
    this.email = _email;
    this.password = _password;
    this.role = 'user';
    this.keranjang = [];
  }
}

// class product
class DB_Produk {
  constructor(_idProduk, _nama, _foto, _desk, _stock, _price) {
    this.idProduk = _idProduk;
    this.nama = _nama;
    this.foto = _foto;
    this.desk = _desk;
    this.stock = _stock;
    this.price = _price;
  }
}

class DB_Keranjang {
  constructor(_id, _nama, _foto, _qty, _price) {
    this.id = _id;
    this.nama = _nama;
    this.foto = _foto;
    this.qty = _qty;
    this.price = _price;
    this.priceTotal = _price * _qty;
  }
}

// method display
btMenu = (menu) => {
  if (menu == 'regis') {
    document.getElementById('regis-page').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
  } else if (menu == 'login') {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('regis-page').style.display = 'none';
  }
};

// method
btRegis = () => {
  let formRegis = document.getElementById('formRegister');
  // validasi form
  if (
    formRegis.elements[0].value == '' ||
    formRegis.elements[1].value == '' ||
    formRegis.elements[2].value == ''
  ) {
    alert('Form tidak boleh kosong');
  } else if (!formRegis.elements[1].value.includes('@')) {
    alert('Format email salah');
  } else if (formRegis.elements[2].value.length < 4) {
    alert('Password anda kurang dari 4 karakter');
  } else {
    if (
      !dbUser.some(
        (item) => item.username == formRegis.elements[0].value.toLowerCase()
      )
    ) {
      dbUser.push(
        new DB_User(
          formRegis.elements[0].value,
          formRegis.elements[1].value,
          formRegis.elements[2].value
        )
      );
      alert('berhasil mendaftar');
    } else {
      alert(`username ${formRegis.elements[0].value} sudah ada`);
    }
  }

  // check data di database
  // console.table(dbUser);
};

btLogin = () => {
  let getUsername = document.getElementById('loginName').value;
  let getPassword = document.getElementById('loginPass').value;

  if (getUsername == '' || getPassword == '') {
    alert('Form harus diisi semua');
  } else {
    dbUser.forEach((item, index) => {
      if (item.username == getUsername && item.password == getPassword) {
        userLogin = index;
        alert(`Selamat datang ${item.username}`);
        document.getElementById('bt-logout').disabled = false;
        document.getElementById('bt-login').disabled = true;
      }
    });

    if (userLogin !== null) {
      if (dbUser[userLogin].role == 'admin') {
        alert(`Kamu Admin`);
        document.getElementById('list-produk').style.display = 'block';
        document.getElementById('addProduct-page').style.display = 'block';
        document.getElementById('order-page').style.display = 'block';
        printProduk();
        printOrder();
      } else if (dbUser[userLogin].role == 'user') {
        alert(`Kamu User`);
        document.getElementById('list-produk').style.display = 'block';
        document.getElementById('cart-page').style.display = 'block';
        printProduk();
        printAddToCart();
      }
      // console.log(`setelah login`, userLogin);
    } else {
      alert(`Akun anda belum terdaftar`);
    }
  }
  // console.log(userLogin);
};

btLogout = () => {
  userLogin = null;
  document.getElementById('bt-logout').disabled = true;
  document.getElementById('bt-login').disabled = false;
  document.getElementById('list-produk').style.display = 'none';
  document.getElementById('cart-page').style.display = 'none';
  document.getElementById('addProduct-page').style.display = 'none';
};

//
btTambah = () => {
  let formProduk = document.getElementById('formProduk');
  if (
    formProduk.elements[0].value == '' ||
    formProduk.elements[1].value == '' ||
    formProduk.elements[2].value == '' ||
    formProduk.elements[3].value == '' ||
    formProduk.elements[4].value == ''
  ) {
    alert('Form tidak boleh kosong');
  } else {
    dbProduk.push(
      new DB_Produk(
        dbProduk.length + 1,
        formProduk.elements[0].value,
        formProduk.elements[1].value,
        formProduk.elements[2].value,
        formProduk.elements[3].value,
        formProduk.elements[4].value
      )
    );
    alert('Data sudah berhasil diinput');
  }
  printProduk();

  // check data di database
  // console.table(dbProduk);
};

printProduk = (idx, data = dbProduk) => {
  let tableElement = '';
  data.forEach((item, i) => {
    if (idx == i) {
      tableElement += `
          <tr>
            <td>${i + 1}</td>
            <td><input type="text" id="updateFoto" value="${item.foto}"/></td>
            <td><input type="text" id="updateNama" value="${item.nama}"/></td>
            <td><input type="text" id="updateDesk" value="${item.desk}"/></td>
            <td><input type="number" id="updateStock" value="${
              item.stock
            }"/></td>
            <td><input type="number" id="updatePrice" value="${
              item.price
            }"/></td>
            <td style="text-align: center">
              <button type='button' onclick='btSave(${i})'>Save</button>
              <button type='button' onclick='printProduk()'>Cancel</button>
            </td>
          </tr>
      `;
    } else {
      tableElement += `
          <tr>
            <td>${i + 1}</td>
            <td style="text-align: center">
            <img src="${item.foto}" width="120px"/>
            </td>
            <td>${item.nama}</td>
            <td>${item.desk}</td>
            <td>${item.stock}</td>
            <td>Rp.${item.price.toLocaleString()}</td>
            <td style="text-align: center">
            ${
              dbUser[userLogin].role == 'user'
                ? `<button type='button' id="bt-edit" onclick='btAddToCart(${i})'>Add to Cart</button>`
                : `<button type='button' id="bt-edit" onclick='btEdit(${i})'>Edit</button>
                <button type='button' id="bt-delete" onclick='btDelete(${i})'>Delete</button>`
            }
            </td>
          </tr>
          `;
    }
  });
  document.getElementById('listProduk').innerHTML = tableElement;
};

btDelete = (i) => {
  dbProduk.splice(i, 1);
  printProduk();
};

btEdit = (i) => {
  console.log(i);
  printProduk(i);
};

btSave = (i) => {
  dbProduk[i].foto = document.getElementById('updateFoto').value;
  dbProduk[i].nama = document.getElementById('updateNama').value;
  dbProduk[i].desk = document.getElementById('updateDesk').value;
  dbProduk[i].stock = parseInt(document.getElementById('updateStock').value);
  dbProduk[i].price = parseInt(document.getElementById('updatePrice').value);
  printProduk();
};

btCariProduk = () => {
  let inSearch = document.getElementById('cariProduk').value;
  let filterAll = dbProduk.filter((item) => {
    return item.nama.toLowerCase().includes(inSearch.toLowerCase());
  });

  // console.log(filterAll);
  printProduk(null, filterAll);
};

btSearchPrice = () => {
  let inMin = parseInt(document.getElementById('inMinPrice').value);
  let inMax = parseInt(document.getElementById('inMaxPrice').value);

  let filterPrice = dbProduk.filter((item) => {
    return item.price >= inMin && item.price <= inMax;
  });

  printProduk(null, filterPrice);
};

btSearchStock = () => {
  let inMinS = parseInt(document.getElementById('inMinStock').value);
  let inMaxS = parseInt(document.getElementById('inMaxStock').value);

  let filterStock = dbProduk.filter((item) => {
    return item.stock >= inMinS && item.stock <= inMaxS;
  });

  printProduk(null, filterStock);
};

btSortBy = () => {
  let option = document.getElementById('sortBy').value;
  console.log(option);
  let sortBy = dbProduk.sort((a, b) => {
    if (option == 'defaultValue') {
      if (a.nama < b.nama) return -1;
      if (a.nama > b.nama) return 1;
      return 0;
    } else if (option == 'minPrice') {
      return a.price - b.price;
    } else if (option == 'maxPrice') {
      return b.price - a.price;
    } else if (option == 'minStock') {
      return a.stock - b.stock;
    } else if (option == 'maxStock') {
      return b.stock - a.stock;
    }
  });
  printProduk(null, sortBy);
};

btResetProduk = () => {
  printProduk();
};

// btAddToCart = (i) => {
//   let index = dbUser[userLogin].keranjang.some(
//     (item) => item.nama == dbProduk[i].nama
//   );

//   let addQty = 1;
//   if (index) {
//     dbUser[userLogin].keranjang[i].qty += addQty;
//     dbProduk[i].stock -= addQty;
//     dbUser[userLogin].keranjang[i].priceTotal =
//       dbUser[userLogin].keranjang[i].price * dbUser[userLogin].keranjang[i].qty;
//   } else {
//     dbProduk[i].stock -= addQty;
//     dbUser[userLogin].keranjang.push(
//       new DB_Keranjang(
//         dbProduk[i].idProduk,
//         dbProduk[i].nama,
//         dbProduk[i].foto,
//         addQty,
//         dbProduk[i].price
//       )
//     );
//     alert('Anda berhasil menambahkan ke keranjang');
//   }

//   printProduk();
//   printAddToCart(null, index);
//   let produkID = dbProduk[i].idProduk;
//   let produkIDCart = dbUser[userLogin].keranjang[1].id;
//   console.log('produk index :', i + 1);
//   console.log('produk id :', produkID);
//   console.log('produk index cart :', produkIDCart);

//   console.log(dbUser);
// };

btAddToCart = (i) => {
  let index = dbUser[userLogin].keranjang.findIndex(
    (item) => item.id === dbProduk[i].idProduk
  );

  let addQty = 1;
  if (index == -1) {
    dbProduk[i].stock -= addQty;
    dbUser[userLogin].keranjang.push(
      new DB_Keranjang(
        dbProduk[i].idProduk,
        dbProduk[i].nama,
        dbProduk[i].foto,
        addQty,
        dbProduk[i].price
      )
    );
  } else if (dbProduk[i].idProduk == dbUser[userLogin].keranjang[index].id) {
    if (dbProduk[i].stock != 0) {
      dbUser[userLogin].keranjang[index].qty += addQty;
      dbUser[userLogin].keranjang[index].priceTotal =
        dbUser[userLogin].keranjang[index].price *
        dbUser[userLogin].keranjang[index].qty;
      dbProduk[i].stock -= addQty;
      console.log('id product cart:', dbUser[userLogin].keranjang[index].id);
    } else {
      alert(`Stock ${dbProduk[i].nama} habis`);
      dbProduk.splice(i, 1);
    }
  }
  printProduk();
  printAddToCart();
};

let itemTerjual = [];

function printAddToCart() {
  let print = '';
  totalBayar = 0;
  dbUser[userLogin].keranjang.forEach((item, i) => {
    print += `
                <tr>
                    <td style="text-align: center">${i + 1}</td>
                    <td><img src="${item.foto}" width="120px"/></td>
                    <td>${item.nama}</td>
                    <td>${item.qty}</td>
                    <td>Rp.${item.price.toLocaleString()}</td>
                    <td>Rp.${item.priceTotal.toLocaleString()}</td>
                    <td style="text-align: center; width: 200px">
                      <button style="margin-bottom: 3px" onclick="btEditCart(${i})">Edit</button>
                      <button style="margin-bottom: 3px" onclick="btDeleteCart(${i})">Delete</button>
                    </td>
                </tr>
                `;
    totalBayar += item.priceTotal;
    itemTerjual.push(item.nama);
  });
  document.getElementById('listKeranjang').innerHTML = print;
  document.getElementById('listCheckout').innerHTML = `
    <thead>
      <th>Total Belanja</th>
      <th>Rp.${totalBayar.toLocaleString()}</th>
      <th><button onclick="btBayar()">Bayar</button></th>
    </thead>  
  `;
}

console.log(`item terjual:`, itemTerjual);

btDeleteCart = (i) => {
  let index = dbProduk.findIndex(
    (item) => item.idProduk == dbUser[userLogin].keranjang[i].id
  );
  console.log(index);
  let deleteQty = 1;
  if (index == -1) {
    dbProduk.push(
      new DB_Produk(
        dbUser[userLogin].keranjang[i].id,
        dbUser[userLogin].keranjang[i].nama,
        dbUser[userLogin].keranjang[i].foto,
        dbProduk[i].desk,
        deleteQty,
        dbProduk[i].price
      )
    );
    dbUser[userLogin].keranjang[i].qty -= deleteQty;
    dbUser[userLogin].keranjang[i].priceTotal =
      dbUser[userLogin].keranjang[i].qty * dbUser[userLogin].keranjang[i].price;
  } else if (dbProduk[index].idProduk == dbUser[userLogin].keranjang[i].id) {
    if (dbUser[userLogin].keranjang[i].qty != 0) {
      dbProduk[index].stock += deleteQty;
      dbUser[userLogin].keranjang[i].qty -= deleteQty;
      dbUser[userLogin].keranjang[i].priceTotal =
        dbUser[userLogin].keranjang[i].qty *
        dbUser[userLogin].keranjang[i].price;
    } else {
      alert(`Stock ${dbProduk[i].nama} habis`);
      dbUser[userLogin].keranjang.splice(i, 1);
    }
  }

  // dbUser[userLogin].keranjang.splice(i, 1);
  // dbProduk.push(dbUser[userLogin].keranjang[i].qty);
  // dbProduk[ind].stock += dbUser[userLogin].keranjang[i].qty;
  printAddToCart();
  printProduk();
};

btEditCart = (i) => {
  let ind = dbProduk.findIndex(
    (item) => item.idProduk == dbUser[userLogin].keranjang[i].id
  );

  let inQtyBaru = parseInt(prompt('masukan qty baru'));
  if (inQtyBaru <= dbProduk[ind].stock + dbUser[userLogin].keranjang[i].qty) {
    dbProduk[ind].stock += dbUser[userLogin].keranjang[i].qty;
    dbUser[userLogin].keranjang[i].qty = inQtyBaru;
    dbProduk[ind].stock -= inQtyBaru;
    dbUser[userLogin].keranjang[i].priceTotal =
      dbUser[userLogin].keranjang[i].price * inQtyBaru;
  } else {
    alert('Qty anda berlebih');
  }
  printProduk();
  printAddToCart();
};

btBayar = () => {
  while (true) {
    let bayar = parseInt(prompt('Silahkan bayar:')) - totalBayar;

    if (bayar < 0) {
      alert('Maaf uang anda kurang');
    } else {
      alert(`
      Kembalian anda Rp${bayar.toLocaleString()}\nTerima kasih`);
      dbUser[userLogin].keranjang = [];
      totalBayar = 0;
      printAddToCart();
      break;
    }
  }
};

function printOrder() {
  let print = '';
  itemTerjual.forEach((item, i) => {
    print += `
                <tr>
                    <td style="text-align: center">${i + 1}</td> 
                    <td>${item}</td>
                </tr>
                `;
  });
  document.getElementById('listOrder').innerHTML = print;
}
