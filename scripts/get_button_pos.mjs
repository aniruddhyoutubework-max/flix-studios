import http from 'http';

http.get('http://localhost:5173/src/components/Navbar.tsx', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Navbar.tsx length on dev server:', data.length);
    console.log('Includes Open mobile menu?', data.includes('Open mobile menu'));
    console.log('Includes Menu icon?', data.includes('Menu className='));
  });
});
