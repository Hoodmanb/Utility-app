// Clear all cookies
Object.keys(req.cookies).forEach(cookieName => {
  res.clearCookie(cookieName);
});

// Optionally, you can also destroy the session if needed
req.session.destroy((err) => {
  if (err) {
    console.error('Error destroying session:', err);
  } else {
    res.send('Session destroyed and all cookies cleared');
  }
});





// Clear session and associated cookies
req.session.destroy((err) => {
  if (err) {
    console.error('Error destroying session:', err);
  } else {
    res.clearCookie('yourCookieName');
    res.send('Session destroyed and cookie cleared');
  }
});