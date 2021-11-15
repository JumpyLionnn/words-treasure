// <reference path="index.ts"/>

app.get('/', (req: any, res: any) => {
    res.sendFile(root + '/client/index.html');
});

app.get('/style.css', (req: any, res: any) => {
    res.sendFile(root + '/client/style/style.css');
});

app.get('/general.css', (req: any, res: any) => {
    res.sendFile(root + '/client/style/general.css');
});

app.get('/index.js', (req: any, res: any) => {
    res.sendFile(root + '/client/build/index.js');
});


app.get('/favicon.ico', (req: any, res: any) => {
    res.sendFile(root + '/client/assets/favicon.ico');
});

app.get('/crown.png', (req: any, res: any) => {
    res.sendFile(root + '/client/assets/crown2.png');
});

app.get('/min.css', (req: any, res: any) => {
    res.sendFile(root + '/client/style.min.css');
});


app.get('/google25a371c5daa2ad1c.html', (req: any, res: any) => {
    res.sendFile(root + '/client/google25a371c5daa2ad1c.html');
});