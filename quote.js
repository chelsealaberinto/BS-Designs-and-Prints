document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('quoteItems');
    const addRowBtn = document.getElementById('addRowBtn');
    const subtotalEl = document.getElementById('subtotal');
    const taxRateEl = document.getElementById('taxRate');
    const taxDueEl = document.getElementById('taxDue');
    const grandTotalEl = document.getElementById('grandTotal');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    // Add a new row
    addRowBtn.addEventListener('click', () => {
        const row = document.createElement('tr');
        row.className = 'item-row';
        row.innerHTML = `
            <td>
                <select class="product-select">
                    <option value="" disabled selected>Select a Product...</option>
                    <optgroup label="Business Cards">
                        <option value="15.00">Standard Cards (100 pcs) - $15.00</option>
                        <option value="30.00">Premium Cards (250 pcs) - $30.00</option>
                        <option value="45.00">Foil Stamped (100 pcs) - $45.00</option>
                    </optgroup>
                    <optgroup label="Apparel">
                        <option value="12.00">Basic Cotton T-Shirt - $12.00/ea</option>
                        <option value="35.00">Premium Blend Hoodie - $35.00/ea</option>
                        <option value="25.00">Embroidered Polo - $25.00/ea</option>
                    </optgroup>
                    <optgroup label="Marketing Materials">
                        <option value="40.00">A5 Flyers (500 pcs) - $40.00</option>
                        <option value="65.00">Tri-fold Brochures (250 pcs) - $65.00</option>
                        <option value="35.00">A3 Posters (50 pcs) - $35.00</option>
                    </optgroup>
                    <optgroup label="Merchandise">
                        <option value="8.00">Ceramic Mug (11oz) - $8.00/ea</option>
                        <option value="20.00">Die-Cut Stickers (100 pcs) - $20.00</option>
                        <option value="10.00">Canvas Tote Bag - $10.00/ea</option>
                    </optgroup>
                    <option value="custom">Custom Item...</option>
                </select>
                <input type="text" class="custom-desc hidden" placeholder="Enter custom description">
            </td>
            <td><input type="number" step="0.01" class="unit-price" placeholder="0.00"></td>
            <td><input type="number" class="qty" placeholder="1" min="1"></td>
            <td class="amount">0.00</td>
            <td class="col-action no-print"><button class="remove-row-btn">&times;</button></td>
        `;
        tbody.appendChild(row);
        attachRowEvents(row);
    });

    // Attach events to a row
    function attachRowEvents(row) {
        const select = row.querySelector('.product-select');
        const customDesc = row.querySelector('.custom-desc');
        const priceInput = row.querySelector('.unit-price');
        const qtyInput = row.querySelector('.qty');
        const removeBtn = row.querySelector('.remove-row-btn');

        select.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customDesc.classList.remove('hidden');
                priceInput.value = '';
            } else {
                customDesc.classList.add('hidden');
                priceInput.value = e.target.value;
            }
            calculateTotals();
        });

        priceInput.addEventListener('input', calculateTotals);
        qtyInput.addEventListener('input', calculateTotals);
        
        if(removeBtn) {
            removeBtn.addEventListener('click', () => {
                row.remove();
                calculateTotals();
            });
        }
    }

    // Attach events to initial row
    attachRowEvents(document.querySelector('.item-row'));

    // Tax rate change
    taxRateEl.addEventListener('input', calculateTotals);

    function calculateTotals() {
        let subtotal = 0;
        const rows = document.querySelectorAll('.item-row');
        
        rows.forEach(row => {
            const price = parseFloat(row.querySelector('.unit-price').value) || 0;
            const qty = parseFloat(row.querySelector('.qty').value) || 0;
            const amount = price * qty;
            
            row.querySelector('.amount').textContent = amount.toFixed(2);
            subtotal += amount;
        });

        const taxRate = parseFloat(taxRateEl.value) || 0;
        const taxDue = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxDue;

        subtotalEl.textContent = subtotal.toFixed(2);
        taxDueEl.textContent = taxDue.toFixed(2);
        grandTotalEl.textContent = grandTotal.toFixed(2);
    }

    // PDF Download
    downloadPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('quoteDocument');
        
        const opt = {
            margin:       10,
            filename:     'Quote_' + (document.getElementById('quoteNumber').value || 'New') + '.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Add class to hide borders and UI elements
        document.body.classList.add('exporting-pdf');
        
        html2pdf().set(opt).from(element).save().then(() => {
            // Remove class after PDF is generated
            document.body.classList.remove('exporting-pdf');
        });
    });

    // Automatically set dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quoteDate').value = today;
    
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);
    document.getElementById('validUntil').value = validDate.toISOString().split('T')[0];
});
