const items = [
    { name: "Item1", price: 0, qty: 0 },
    { name: "Item2", price: 0, qty: 0 },
    { name: "Item3", price: 0, qty: 0 },
    { name: "Item4", price: 0, qty: 0 },
    { name: "Item5", price: 0, qty: 0 },
    { name: "Item6", price: 0, qty: 0 },
    { name: "Item7", price: 0, qty: 0 },
    { name: "Item8", price: 0, qty: 0 },
    { name: "Item9", price: 0, qty: 0 },
    { name: "Item10", price: 0, qty: 0 },
    { name: "Item11", price: 0, qty: 0 },
    { name: "Item12", price: 0, qty: 0 }
];

// State
let currentDay = 1;
let totalDays = 30;
let dailyComposition = items.map(i => ({ ...i, qty: 0 })); // For current day's input
let monthlyComposition = items.map(i => ({ ...i, qty: 0 })); // Accumulated total

// DOM Elements
const setupPanel = document.getElementById('setup-panel');
const dayPanel = document.getElementById('day-panel');
const startBtn = document.getElementById('start-btn');
const nextDayBtn = document.getElementById('next-day-btn');
const finishBtn = document.getElementById('finish-btn');
const currentDayDisplay = document.getElementById('current-day-display');
const exportBtn = document.getElementById('export-btn');
const grandTotalDisplay = document.getElementById('grand-total');
const tableBody = document.getElementById('billing-body');
const totalDaysInput = document.getElementById('total-days');

// --- Initialization ---
function init() {
    renderTable();
    startBtn.addEventListener('click', startMonth);
    nextDayBtn.addEventListener('click', nextDay);
    finishBtn.addEventListener('click', finishMonth);
    exportBtn.addEventListener('click', exportToCSV);
}

// --- Logic ---

function startMonth() {
    totalDays = parseInt(totalDaysInput.value) || 30;
    currentDay = 1;

    // Reset data
    dailyComposition.forEach(i => i.qty = 0);
    monthlyComposition.forEach(i => i.qty = 0);

    // Update UI
    setupPanel.classList.add('hidden');
    dayPanel.classList.remove('hidden');
    exportBtn.classList.add('hidden');

    updateDayDisplay();
    renderTable();
    updateGrandTotal();
}

function nextDay() {
    // 1. Accumulate daily inputs to monthly totals
    dailyComposition.forEach((dailyItem, index) => {
        monthlyComposition[index].qty += dailyItem.qty;
        // Reset daily for next day
        dailyItem.qty = 0;
    });

    // 2. Increment Day
    currentDay++;

    // 3. Check if finished
    if (currentDay > totalDays) {
        finishMonth();
    } else {
        updateDayDisplay();
        renderTable(); // Re-renders with cleared inputs and updated totals
        // Update Grand Total based on MONTHLY composition now? 
        // Actually, grand total should be running sum. 
        updateGrandTotal();
    }
}

function finishMonth() {
    // If called directly via button (early finish) or auto-finish
    // Ensure last day's data is saved if we are clicking "Finish" manually?
    // In this flow, "Next Day" becomes "Finish" on the last day.

    // UI Updates
    dayPanel.classList.add('hidden');
    setupPanel.classList.remove('hidden'); // Allow starting over
    exportBtn.classList.remove('hidden');

    // Disable inputs effectively by re-rendering in "view only" mode or just keeping it as is?
    // For now, let's just show the export button.

    alert(`Billing for ${totalDays} days completed!`);
}

function updateDayDisplay() {
    currentDayDisplay.textContent = `Day ${currentDay} of ${totalDays}`;

    if (currentDay === totalDays) {
        nextDayBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextDayBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    }
}

function renderTable() {
    tableBody.innerHTML = '';

    items.forEach((item, index) => {
        // Calculate costs based on TOTAL accumulated quantity
        const totalQty = monthlyComposition[index].qty;
        const subtotal = item.price * totalQty;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <input type="number" 
                       min="0" 
                       class="qty-input" 
                       value="${dailyComposition[index].qty}"
                       data-index="${index}">
            </td>
            <td class="total-qty">${totalQty}</td>
            <td id="subtotal-${index}">₹${subtotal.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    addInputListeners();
}

function addInputListeners() {
    const inputs = document.querySelectorAll('.qty-input');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            const newQty = parseInt(e.target.value) || 0;

            // Update Daily State
            dailyComposition[index].qty = newQty;

            // Note: Grand total in the C++ version is the FINAL total.
            // But usually, user wants to see running total.
            // Let's show (Accumulated Total + Current Day Potential Total)
            updateGrandTotal();
        });
    });
}

function updateGrandTotal() {
    let total = 0;
    monthlyComposition.forEach((item, index) => {
        // Existing total
        total += item.price * item.qty;
        // Plus current day's input
        total += item.price * dailyComposition[index].qty;
    });
    grandTotalDisplay.textContent = `₹${total.toFixed(2)}`;
}

function exportToCSV() {
    const month = document.getElementById('billing-month').value || 'Bill';
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Item Name,Total Quantity,Rate,Subtotal\n";

    let grandTotal = 0;
    monthlyComposition.forEach((item, index) => {
        // Add any pending daily input if they clicked export before finishing day (edge case)
        // But normally they finish first.
        const finalQty = item.qty;
        if (finalQty > 0) {
            const subtotal = item.price * finalQty;
            grandTotal += subtotal;
            csvContent += `${item.name},${finalQty},${item.price},${subtotal}\n`;
        }
    });

    csvContent += `,,,Total Revenue:,${grandTotal}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${month}_Bill.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Start
init();
