const tableCour = document.getElementById('tableCour');

tableCour.addEventListener('click', async (e) => {
  if (e.target.tagName === 'BUTTON') {
    const orderId = e.target.dataset.id;

    const response = await fetch('/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (response.ok) {
      window.location.href = 'http://localhost:3000/courier';
    }
  }
});
