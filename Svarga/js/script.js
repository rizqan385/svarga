        // Global variables
        let currentMenu = '';
        let currentPrice = 0;
        
        // Open order modal
        function openOrderModal(menuName, price) {
            currentMenu = menuName;
            currentPrice = price;
            
            // Update modal title
            document.getElementById('modalMenuTitle').textContent = `Pesan ${menuName}`;
            
            // Update order summary
            document.getElementById('summaryMenu').textContent = menuName;
            document.getElementById('summaryTotal').textContent = `Rp ${price.toLocaleString('id-ID')}`;
            
            // Reset form
            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('quantity').value = '1';
            document.getElementById('deliveryAddress').value = '';
            document.getElementById('orderNotes').value = '';
            
            // Show modal
            document.getElementById('orderModal').classList.add('active');
            
            // Set first payment method as active
            selectPaymentMethod('cash');
        }
        
        // Close order modal
        function closeOrderModal() {
            document.getElementById('orderModal').classList.remove('active');
        }
        
        // Toggle delivery address field
        function toggleDeliveryAddress(show) {
            const addressGroup = document.getElementById('addressGroup');
            const addressField = document.getElementById('deliveryAddress');
            
            if (show) {
                addressGroup.classList.remove('hidden');
                addressField.required = true;
            } else {
                addressGroup.classList.add('hidden');
                addressField.required = false;
            }
        }
        
        // Select payment method
        function selectPaymentMethod(method) {
            // Remove active class from all payment methods
            document.querySelectorAll('.payment-method').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to selected method
            document.querySelector(`.payment-method[onclick="selectPaymentMethod('${method}')"]`).classList.add('active');
            
            // Update payment method in summary
            let paymentText = '';
            switch(method) {
                case 'cash': paymentText = 'Tunai (COD)'; break;
                case 'dana': paymentText = 'DANA'; break;
                case 'gopay': paymentText = 'GoPay'; break;
                case 'ovo': paymentText = 'OVO'; break;
                case 'transfer': paymentText = 'Transfer Bank'; break;
                case 'qris': paymentText = 'QRIS'; break;
            }
            
            document.getElementById('summaryPayment').textContent = paymentText;
        }
        
        // Update order summary
        function updateOrderSummary() {
            const quantity = document.getElementById('quantity').value;
            const spicyLevel = document.querySelector('input[name="spicyLevel"]:checked').value;
            const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
            
            // Calculate total price
            const totalPrice = quantity * currentPrice;
            
            // Update summary
            document.getElementById('summaryQuantity').textContent = `${quantity} Paket`;
            document.getElementById('summarySpice').textContent = spicyLevel;
            document.getElementById('summaryDelivery').textContent = deliveryMethod;
            document.getElementById('summaryTotal').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        }
        
        // Submit order
        function submitOrder() {
            // Get form values
            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const quantity = document.getElementById('quantity').value;
            const spicyLevel = document.querySelector('input[name="spicyLevel"]:checked').value;
            const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
            const address = deliveryMethod === 'Diantar' ? document.getElementById('deliveryAddress').value : 'Ambil Sendiri';
            const notes = document.getElementById('orderNotes').value;
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            const totalPrice = quantity * currentPrice;
            
            // Validate form
            if (!name || !phone) {
                alert('Harap isi nama dan nomor WhatsApp Anda');
                return;
            }
            
            if (deliveryMethod === 'Diantar' && !address) {
                alert('Harap isi alamat pengiriman');
                return;
            }
            
            // Format WhatsApp message
            const message = `Halo, saya ingin memesan:
            
🍽 *Menu*: ${currentMenu}
🔢 *Jumlah*: ${quantity} Paket (isi ${quantity * 4})
🌶 *Level Pedas*: ${spicyLevel}
🚚 *Pengiriman*: ${deliveryMethod}
🏠 *Alamat*: ${address}
📝 *Catatan*: ${notes || '-'}
💳 *Pembayaran*: ${paymentMethod}
💰 *Total*: Rp ${totalPrice.toLocaleString('id-ID')}

*Data Pemesan*:
👤 Nama: ${name}
📱 WhatsApp: ${phone}

Silakan konfirmasi ketersediaan dan total yang harus dibayar. Terima kasih!`;
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(message);
            
            // Open WhatsApp
            window.open(`https://wa.me/6285213963005?text=${encodedMessage}`, '_blank');
            
            // Close modal
            closeOrderModal();
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Set first payment method as active by default
            selectPaymentMethod('cash');
            
            // Close modal when clicking outside
            document.getElementById('orderModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeOrderModal();
                }
            });
            
            // Prevent form submission
            document.getElementById('orderForm').addEventListener('submit', function(e) {
                e.preventDefault();
            });
            
            // Phone number input validation
            document.getElementById('customerPhone').addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        });

function toggleMenu() {
  document.querySelector('nav').classList.toggle('show');
}

// Tutup menu saat klik di luar nav dan toggle
document.addEventListener('click', function (event) {
  const nav = document.querySelector('nav');
  const toggleBtn = document.querySelector('.toggle');

  const isClickInsideNav = nav.contains(event.target);
  const isClickOnToggle = toggleBtn.contains(event.target);

  if (!isClickInsideNav && !isClickOnToggle) {
    nav.classList.remove('show');
  }
});
