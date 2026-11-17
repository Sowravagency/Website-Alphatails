document.addEventListener('DOMContentLoaded', () => {
    loadAdminBookings();
});

function loadAdminBookings() {
    const tableBody = document.getElementById('adminBookingTableBody'); // Update with your actual table body ID
    if (!tableBody) return;

    const bookings = JSON.parse(localStorage.getItem('alphatails_bookings') || '[]');
    
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500">No bookings found yet.</td></tr>`;
        return;
    }

    bookings.forEach((b, index) => {
        const row = document.createElement('tr');
        row.className = "border-b border-slate-100 hover:bg-slate-50 transition";
        row.innerHTML = `
            <td class="py-3 px-4 font-bold text-xs text-[#023047]">${b.id}</td>
            <td class="py-3 px-4 text-xs font-semibold text-slate-700">${b.customerName}<br><span class="text-[10px] text-slate-400">${b.phone}</span></td>
            <td class="py-3 px-4 text-xs text-slate-600">${b.service}</td>
            <td class="py-3 px-4 text-xs text-slate-600">${b.date} at ${b.time}</td>
            <td class="py-3 px-4 text-xs"><span class="px-2 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">${b.status}</span></td>
            <td class="py-3 px-4 text-xs">
                <button onclick="deleteBooking(${index})" class="text-red-500 hover:text-red-700 font-bold"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem('alphatails_bookings') || '[]');
    bookings.splice(index, 1);
    localStorage.setItem('alphatails_bookings', JSON.stringify(bookings));
    loadAdminBookings();
}
