# VoucherIn - E-Commerce Website

VoucherIn adalah aplikasi e-commerce berbasis web yang berfokus pada penjualan produk digital dan penggunaan voucher promo. Aplikasi ini terdiri dari dua bagian utama, yaitu frontend untuk tampilan pengguna dan backend sebagai REST API untuk mengelola data, autentikasi, produk, voucher, cart, order, serta dashboard admin.

## Repository

Project ini dibagi menjadi dua repository:

```bash
Frontend : E-Commerce-Website
Backend  : E-Commerce-Project-Backend
```

Frontend digunakan untuk menampilkan halaman aplikasi kepada pengguna, sedangkan backend digunakan sebagai server API yang terhubung ke database MySQL.

## Fitur Utama

### 1. Autentikasi Pengguna

Aplikasi mendukung fitur register, login, logout, dan penyimpanan token login menggunakan JWT. Setelah login, data pengguna dan token akan disimpan di local storage sehingga user dapat mengakses fitur yang membutuhkan autentikasi.

Role pengguna dibagi menjadi dua:

* `user`: pengguna biasa yang dapat melihat produk, menggunakan voucher, mengelola cart, dan checkout.
* `admin`: pengguna dengan akses khusus untuk mengelola produk, voucher, order, dan dashboard.

### 2. Halaman Produk

User dapat melihat daftar produk yang tersedia di aplikasi. Produk dapat difilter berdasarkan kategori dan dicari berdasarkan nama produk. Setiap produk memiliki informasi seperti nama produk, kategori, deskripsi, gambar, harga, dan stok.

Admin dapat menambahkan, mengedit, dan menghapus produk melalui halaman khusus admin.

### 3. Halaman Voucher

Aplikasi menyediakan daftar voucher yang dapat digunakan oleh user saat checkout. Voucher dapat memiliki tipe diskon berbeda, yaitu:

* `percentage`: diskon berdasarkan persentase.
* `fixed`: potongan harga tetap.
* `shipping`: potongan biaya pengiriman atau promo ongkir.

Voucher juga memiliki aturan seperti kategori tertentu, minimal pembelian, batas maksimal diskon, kuota, jumlah penggunaan, tanggal mulai, tanggal berakhir, dan status aktif atau tidak aktif.

### 4. Cart / Keranjang Belanja

User dapat menambahkan produk ke cart, mengubah jumlah item, mengurangi jumlah item, menghapus item tertentu, atau mengosongkan seluruh cart. Sistem juga melakukan pengecekan stok agar user tidak bisa menambahkan produk melebihi jumlah stok yang tersedia.

### 5. Checkout dengan Voucher

Pada halaman checkout, user dapat memasukkan kode voucher. Sistem akan melakukan validasi terhadap voucher, seperti:

* Apakah voucher ditemukan.
* Apakah voucher masih aktif.
* Apakah voucher masih dalam masa berlaku.
* Apakah kuota voucher masih tersedia.
* Apakah kategori produk di cart cocok dengan kategori voucher.
* Apakah minimal pembelian sudah terpenuhi.

Jika voucher valid, sistem akan menghitung total bruto, jumlah diskon, dan total netto. Setelah checkout berhasil, sistem akan membuat order baru, menyimpan item order, mengurangi stok produk, menambah jumlah penggunaan voucher, dan mengosongkan cart user.

### 6. Admin Dashboard

Admin dashboard digunakan untuk memantau data penjualan dan performa voucher. Dashboard menampilkan ringkasan data seperti total user, total produk, total voucher, total order, total revenue, dan total item terjual.

Selain itu, dashboard juga menampilkan data seperti:

* Daily sales.
* Top vouchers.
* Top products with promo.
* Order status.
* Daftar order user.
* Update status order menjadi `paid`, `completed`, atau `cancelled`.

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* shadcn/ui
* React Bootstrap
* Recharts
* Sonner
* Lucide React

### Backend

* Node.js
* Express.js
* MySQL
* mysql2
* JWT / JSON Web Token
* bcrypt
* dotenv
* CORS
* Nodemon

## Struktur Project

### Frontend

```bash
E-Commerce-Website
├── public
├── src
│   ├── Route
│   ├── assets
│   ├── components
│   │   ├── ui
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProductCreatePage.jsx
│   │   ├── AdminProductEditPage.jsx
│   │   ├── AdminVoucherEditPage.jsx
│   │   ├── AdminVouchersCreatePage.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── Cards.jsx
│   │   ├── Carousel.jsx
│   │   ├── CheckoutDisplay.jsx
│   │   ├── ProductDisplay.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── VoucherCard.jsx
│   │   ├── VoucherDisplay.jsx
│   │   └── cartContext.jsx
│   ├── data
│   ├── layout
│   ├── lib
│   ├── pages
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── SignInPage.jsx
│   │   └── VoucherPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

### Backend

```bash
E-Commerce-Project-Backend
├── backup
│   ├── category.sql
│   ├── product.sql
│   ├── tables.sql
│   └── vouchers.sql
├── config
│   └── db.js
├── middleware
│   ├── adminMiddleware.js
│   └── authMiddleware.js
├── routes
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── dashboardRoute.js
│   ├── orderRoute.js
│   ├── productRoute.js
│   └── voucherRoutes.js
├── utils
│   └── cartHelper.js
├── seedadmin.js
├── server.js
└── package.json
```

## Struktur Database

Database menggunakan MySQL. Tabel utama yang digunakan dalam aplikasi adalah:

| Tabel         | Fungsi                              |
| ------------- | ----------------------------------- |
| `users`       | Menyimpan data user dan admin       |
| `categories`  | Menyimpan kategori produk           |
| `products`    | Menyimpan data produk               |
| `vouchers`    | Menyimpan data voucher promo        |
| `carts`       | Menyimpan cart milik user           |
| `cart_items`  | Menyimpan item dalam cart           |
| `orders`      | Menyimpan data transaksi/order      |
| `order_items` | Menyimpan detail produk dalam order |

File SQL untuk membuat tabel dan mengisi data awal tersedia di folder `backup`.

## Cara Menjalankan Project

### 1. Clone Repository

Clone repository frontend dan backend:

```bash
git clone https://github.com/DarrenCasper/E-Commerce-Website.git
git clone https://github.com/DarrenCasper/E-Commerce-Project-Backend.git
```

## Setup Backend

Masuk ke folder backend:

```bash
cd E-Commerce-Project-Backend
```

Install dependencies:

```bash
npm install
```

Buat file `.env` di root folder backend:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=voucherin_db
JWT_SECRET=your_jwt_secret_key
```

Catatan: frontend pada project ini menggunakan API ke `http://localhost:5000`, jadi disarankan backend dijalankan pada port `5000`. Jika backend dijalankan pada port lain, URL API di frontend perlu disesuaikan.

### 2. Setup Database

Buat database baru di MySQL:

```sql
CREATE DATABASE voucherin_db;
USE voucherin_db;
```

Import file SQL dari folder `backup` dengan urutan berikut:

```sql
source backup/tables.sql;
source backup/category.sql;
source backup/product.sql;
source backup/vouchers.sql;
```

Atau import file tersebut melalui MySQL Workbench/phpMyAdmin sesuai kebutuhan.

### 3. Seed Admin

Untuk membuat akun admin awal, jalankan:

```bash
node seedadmin.js
```

Akun admin default:

```bash
Email    : admin@voucherin.com
Password : admin123
```

### 4. Jalankan Backend

```bash
npm run dev
```

Jika berhasil, server akan berjalan dan API dapat diakses melalui:

```bash
http://localhost:5000
```

## Setup Frontend

Masuk ke folder frontend:

```bash
cd E-Commerce-Website
```

Install dependencies:

```bash
npm install
```

Jalankan aplikasi frontend:

```bash
npm run dev
```

Frontend akan berjalan di Vite development server, biasanya pada:

```bash
http://localhost:5173
```

## API Endpoint Utama

### Auth

| Method | Endpoint             | Fungsi                                |
| ------ | -------------------- | ------------------------------------- |
| `POST` | `/api/auth/register` | Register user baru                    |
| `POST` | `/api/auth/login`    | Login user/admin                      |
| `GET`  | `/api/auth/me`       | Mengambil data user yang sedang login |

### Categories

| Method   | Endpoint              | Fungsi                            |
| -------- | --------------------- | --------------------------------- |
| `GET`    | `/api/categories`     | Mengambil semua kategori          |
| `GET`    | `/api/categories/:id` | Mengambil kategori berdasarkan ID |
| `POST`   | `/api/categories`     | Membuat kategori baru, admin only |
| `PUT`    | `/api/categories/:id` | Mengubah kategori, admin only     |
| `DELETE` | `/api/categories/:id` | Menghapus kategori, admin only    |

### Products

| Method   | Endpoint                              | Fungsi                                |
| -------- | ------------------------------------- | ------------------------------------- |
| `GET`    | `/api/products`                       | Mengambil semua produk                |
| `GET`    | `/api/products/:id`                   | Mengambil produk berdasarkan ID       |
| `GET`    | `/api/products/category/:id_category` | Mengambil produk berdasarkan kategori |
| `POST`   | `/api/products`                       | Membuat produk baru, admin only       |
| `PUT`    | `/api/products/:id`                   | Mengubah produk, admin only           |
| `DELETE` | `/api/products/:id`                   | Menghapus produk, admin only          |

### Vouchers

| Method   | Endpoint            | Fungsi                           |
| -------- | ------------------- | -------------------------------- |
| `GET`    | `/api/vouchers`     | Mengambil semua voucher          |
| `GET`    | `/api/vouchers/:id` | Mengambil voucher berdasarkan ID |
| `POST`   | `/api/vouchers`     | Membuat voucher baru, admin only |
| `PUT`    | `/api/vouchers/:id` | Mengubah voucher, admin only     |
| `DELETE` | `/api/vouchers/:id` | Menghapus voucher, admin only    |

### Cart

| Method   | Endpoint                       | Fungsi                     |
| -------- | ------------------------------ | -------------------------- |
| `GET`    | `/api/cart`                    | Mengambil cart user        |
| `POST`   | `/api/cart/add`                | Menambahkan produk ke cart |
| `PUT`    | `/api/cart/item/:id_cart_item` | Mengubah quantity item     |
| `DELETE` | `/api/cart/item/:id_cart_item` | Menghapus item dari cart   |
| `DELETE` | `/api/cart/clear`              | Mengosongkan cart          |

### Orders

| Method | Endpoint                 | Fungsi                            |
| ------ | ------------------------ | --------------------------------- |
| `GET`  | `/api/orders`            | Mengambil semua order, admin only |
| `GET`  | `/api/orders/:id`        | Mengambil detail order            |
| `POST` | `/api/orders/checkout`   | Melakukan checkout                |
| `PUT`  | `/api/orders/:id/status` | Mengubah status order, admin only |

### Dashboard

| Method | Endpoint                                 | Fungsi                                              |
| ------ | ---------------------------------------- | --------------------------------------------------- |
| `GET`  | `/api/dashboard`                         | Mengambil data order untuk dashboard                |
| `GET`  | `/api/dashboard/summary`                 | Mengambil ringkasan data                            |
| `GET`  | `/api/dashboard/order-status`            | Mengambil jumlah order berdasarkan status           |
| `GET`  | `/api/dashboard/top-vouchers`            | Mengambil voucher yang paling sering digunakan      |
| `GET`  | `/api/dashboard/top-products`            | Mengambil produk teratas yang dibeli dengan voucher |
| `GET`  | `/api/dashboard/sales-by-period/daily`   | Mengambil data penjualan harian                     |
| `GET`  | `/api/dashboard/sales-by-period/monthly` | Mengambil data penjualan bulanan                    |
| `GET`  | `/api/dashboard/total-discount`          | Mengambil total diskon yang sudah diberikan         |

## Alur Penggunaan Aplikasi

1. User membuka website VoucherIn.
2. User dapat melihat daftar produk dan voucher.
3. User melakukan register atau login.
4. User menambahkan produk ke cart.
5. User membuka halaman checkout.
6. User dapat memasukkan kode voucher.
7. Sistem memvalidasi voucher berdasarkan kategori, tanggal berlaku, kuota, dan minimal pembelian.
8. User melakukan checkout.
9. Backend membuat order baru, menyimpan detail order, mengurangi stok produk, dan mengosongkan cart.
10. Admin dapat memantau transaksi melalui admin dashboard.

## Catatan Pengembangan

Beberapa hal yang dapat dikembangkan lebih lanjut:

* Menambahkan sistem pembayaran nyata.
* Menambahkan upload gambar produk.
* Menambahkan halaman riwayat pesanan untuk user.
* Menambahkan fitur search dan filter yang lebih detail.
* Menambahkan audit trail untuk aktivitas admin.
* Menambahkan validasi form yang lebih lengkap.
* Memindahkan base URL API frontend ke file environment agar lebih mudah dikonfigurasi.
* Menambahkan deployment frontend dan backend.

## Author

  Project ini dikerjakan secara Kelompok oleh:
  1. Darren Dexter Thio
  2. Valian Tsaqif Hidayat
  3. Ilan Hawwari Prasojo
  4. Bagas Aryo Dananjoyo
