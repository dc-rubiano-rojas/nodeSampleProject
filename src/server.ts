import { app } from './app';    

app.listen((app.get('port')), ()=> {
    console.log('Aplication is runing on port', app.get('port'));
});