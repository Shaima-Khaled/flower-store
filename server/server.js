import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, 'data', 'products.json');
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

// Helper to read JSON data safely
function readData(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Helper to write JSON data safely
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// ========================
// PRODUCTS ENDPOINTS
// ========================

// GET all products with filtering & search
app.get('/api/products', (req, res) => {
  let products = readData(productsFilePath, []);
  const { category, search, featured, maxPrice } = req.query;

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }

  if (maxPrice) {
    products = products.filter(p => p.price <= Number(maxPrice));
  }

  if (search) {
    const q = search.trim().toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.flowerTypes && p.flowerTypes.some(t => t.toLowerCase().includes(q)))
    );
  }

  return res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const products = readData(productsFilePath, []);
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json(product);
});

// POST new product (Admin)
app.post('/api/products', (req, res) => {
  const products = readData(productsFilePath, []);
  const {
    name,
    subtitle,
    price,
    originalPrice,
    category,
    categoryName,
    image,
    stock,
    featured,
    description,
    flowerTypes,
    vaseIncluded,
    careTips
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'يرجى تزويد اسم المنتج، السعر، والتصنيف' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    subtitle: subtitle || '',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    category,
    categoryName: categoryName || 'باقات زهور',
    image: image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 1,
    stock: stock !== undefined ? Number(stock) : 10,
    featured: Boolean(featured),
    description: description || '',
    flowerTypes: Array.isArray(flowerTypes) ? flowerTypes : (flowerTypes ? flowerTypes.split(',').map(s => s.trim()) : ['ورد جوري']),
    vaseIncluded: Boolean(vaseIncluded),
    careTips: careTips || 'يُحفظ في مكان معتدل البرودة مع تغيير الماء بانتظام.'
  };

  products.unshift(newProduct);
  writeData(productsFilePath, products);

  res.status(201).json(newProduct);
});

// PUT update product (Admin)
app.put('/api/products/:id', (req, res) => {
  const products = readData(productsFilePath, []);
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  const existing = products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent changing ID
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? (req.body.originalPrice ? Number(req.body.originalPrice) : null) : existing.originalPrice,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock
  };

  products[index] = updated;
  writeData(productsFilePath, products);

  res.json(updated);
});

// DELETE product (Admin)
app.delete('/api/products/:id', (req, res) => {
  let products = readData(productsFilePath, []);
  const exists = products.some(p => p.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  products = products.filter(p => p.id !== req.params.id);
  writeData(productsFilePath, products);

  res.json({ message: 'تم حذف المنتج بنجاح', id: req.params.id });
});

// ========================
// CATEGORIES ENDPOINT
// ========================
app.get('/api/categories', (req, res) => {
  const products = readData(productsFilePath, []);
  
  const categoryDefs = [
    { id: 'all', name: 'جميع الباقات', icon: 'Sparkles' },
    { id: 'romantic', name: 'حب ورومانسية', icon: 'Heart' },
    { id: 'graduation', name: 'تخرج وإنجاز', icon: 'GraduationCap' },
    { id: 'newborn', name: 'مواليد وبيبي', icon: 'Baby' },
    { id: 'luxury', name: 'فازات فاخرة', icon: 'Crown' },
    { id: 'gifts', name: 'ورود مع هدايا', icon: 'Gift' }
  ];

  const categoriesWithCounts = categoryDefs.map(cat => {
    const count = cat.id === 'all' 
      ? products.length 
      : products.filter(p => p.category === cat.id).length;
    return { ...cat, count };
  });

  res.json(categoriesWithCounts);
});

// ========================
// ORDERS ENDPOINTS
// ========================

// GET all orders (Admin) with filter
app.get('/api/orders', (req, res) => {
  let orders = readData(ordersFilePath, []);
  const { status, search } = req.query;

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.phone && o.customer.phone.includes(q)) ||
      (o.recipient?.name && o.recipient.name.toLowerCase().includes(q))
    );
  }

  // Sort latest first
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(orders);
});

// GET single order by ID (Tracking or Admin)
app.get('/api/orders/:id', (req, res) => {
  const orders = readData(ordersFilePath, []);
  const order = orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());

  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على طلب بهذا الرقم' });
  }

  res.json(order);
});

// POST create new order (Checkout)
app.post('/api/orders', (req, res) => {
  const orders = readData(ordersFilePath, []);
  const products = readData(productsFilePath, []);
  
  const {
    customer,
    recipient,
    items,
    discountCode,
    paymentMethod
  } = req.body;

  if (!customer?.name || !customer?.phone) {
    return res.status(400).json({ error: 'يرجى إدخال بيانات صاحب الطلب (الاسم ورقم الجوال)' });
  }

  if (!recipient?.name || !recipient?.city || !recipient?.addressDetails) {
    return res.status(400).json({ error: 'يرجى إدخال تفاصيل المستلم وعنوان التوصيل' });
  }

  if (!items || !items.length) {
    return res.status(400).json({ error: 'السلة فارغة، يرجى اختيار ورود أولاً' });
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  let discount = 0;
  if (discountCode && discountCode.toUpperCase() === 'WARD10') {
    discount = Math.round(subtotal * 0.1);
  }
  const deliveryFee = 25;
  const total = subtotal - discount + deliveryFee;

  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const newOrder = {
    id: orderId,
    createdAt: now,
    customer,
    recipient,
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    paymentMethod: paymentMethod || 'mada',
    status: 'received',
    statusHistory: [
      {
        status: 'received',
        time: now,
        note: 'تم استلام طلبكم بنجاح وجاري مراجعته'
      }
    ]
  };

  // Decrement stock in products
  items.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (product && product.stock > 0) {
      product.stock = Math.max(0, product.stock - cartItem.quantity);
    }
  });
  writeData(productsFilePath, products);

  orders.unshift(newOrder);
  writeData(ordersFilePath, orders);

  res.status(201).json(newOrder);
});

// PATCH update order status (Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const orders = readData(ordersFilePath, []);
  const { status, note } = req.body;

  const validStatuses = ['received', 'in_preparation', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'حالة الطلب غير صالحة' });
  }

  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }

  const statusLabels = {
    received: 'تم استلام الطلب',
    in_preparation: 'جاري تنسيق الأزهار وتجهيز الكرت',
    out_for_delivery: 'الطلب في طريقه للتوصيل مع المندوب',
    delivered: 'تم تسليم الطلب بنجاح للمستلم',
    cancelled: 'تم إلغاء الطلب'
  };

  order.status = status;
  if (!order.statusHistory) {
    order.statusHistory = [];
  }

  order.statusHistory.push({
    status,
    time: new Date().toISOString(),
    note: note || statusLabels[status]
  });

  writeData(ordersFilePath, orders);
  res.json(order);
});

// ========================
// ADMIN STATS ENDPOINT
// ========================
app.get('/api/stats', (req, res) => {
  const products = readData(productsFilePath, []);
  const orders = readData(ordersFilePath, []);

  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'received' || o.status === 'in_preparation').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;

  res.json({
    totalSales,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalProducts,
    lowStockProducts
  });
});

// ========================
// SERVE STATIC CLIENT BUILD (Single Fullstack Service)
// ========================
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🌸 Flower Store Server is running on port http://localhost:${PORT}`);
});

