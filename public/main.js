const table = document.getElementById('table');











table.addEventListener('click', async (e) => {
  if (e.target.tagName === 'BUTTON') {
    const orderId = e.target.dataset.id

    const response = await fetch('/', {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    if (response.ok) {
      window.location.href = 'http://localhost:3000';
    }


  }

})


