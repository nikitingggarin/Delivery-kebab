const { registerForm, loginForm } = document;

if (registerForm) {
  registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const { action, method } = evt.target;

    const formData = Object.fromEntries(new FormData(evt.target));

    const response = await fetch(action, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.replace(data.link);
    } else {
      const error = document.querySelector('.error');
      error.innerText = data.error.message;
      // console.log(data);
    }
  });
}
if (loginForm) {
  loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const { action, method } = evt.target;

    const formData = Object.fromEntries(new FormData(evt.target));

    const response = await fetch(action, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      window.location.replace(data.link);
    } else {
      const error = document.querySelector('.error');
      error.innerText = data.error.message;
      // console.log(data);
    }
  });
}
