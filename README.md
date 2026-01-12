# Monthly Billing System (C++)

A simple yet practical **C++ console-based monthly billing system** that records daily item-wise quantities, generates a final monthly bill, and exports the data into a **CSV file** that can be directly opened in **Microsoft Excel**.

Designed for small businesses, shops, or academic projects where lightweight billing and reporting is needed without using databases or external libraries.

---

## 🚀 Features

- 📅 Month-wise billing
- 🧾 Daily quantity input for multiple items
- ➕ Automatic aggregation of quantities
- ✏️ Edit quantities before finalizing the bill
- 📊 Clean tabular bill display in console
- 📁 Export final bill to **CSV format**
- 📈 Excel-compatible output for further analysis

---

## 🛠️ Tech Stack

- **Language:** C++
- **Concepts Used:**
  - Structures (`struct`)
  - Vectors (`std::vector`)
  - File handling (`fstream`)
  - Formatted output (`iomanip`)
  - Modular functions

No external dependencies. Pure standard C++.

---

## 📂 Output Format (CSV)

Item Name, Total Quantity, Rate, Subtotal
Item1, 25, 10, 250
Item2, 12, 15, 180
...
Total Revenue, , , 430


You can directly open this file in **Excel**, **Google Sheets**, or any spreadsheet software.

---
🧑‍💻 How It Works

User enters the billing month and number of days

For each day:

Inputs quantity for each predefined item

System:

Aggregates quantities

Calculates subtotals and grand total

Optional:

Edit item quantities before finalizing

Final bill:

Displayed in console

Exported as a CSV file

📌 Use Cases

Small shop monthly billing

Mess / canteen record keeping

Inventory tracking (basic)

Academic mini-project

CSV data generation for Excel analysis

🔮 Future Improvements

Add item price input support

Dynamic item addition/removal

GST/tax calculation

PDF invoice generation

Database integration

GUI or Web version

### 1️⃣ Compile
```bash
g++ billing_system.cpp -o billing

./billing

