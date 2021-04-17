app.get('/', (req: any, res: any) => {
    let root = __dirname.slice(0, __dirname.length - 6);
    res.sendFile(root + '/client/index.html');
});

app.get('/style.css', (req: any, res: any) => {
    res.sendFile(root + '/client/style/style.css');
});

app.get('/general.css', (req: any, res: any) => {
    res.sendFile(root + '/client/style/general.css');
});

app.get('/main.js', (req: any, res: any) => {
    res.sendFile(root + '/client/main.js');
});


app.get('/favicon.ico', (req: any, res: any) => {
    res.sendFile(root + '/client/assets/favicon.ico');
});

app.get('/crown.png', (req: any, res: any) => {
    res.sendFile(root + '/client/assets/crown2.png');
});