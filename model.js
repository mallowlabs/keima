const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/keimadb');
const AppSchema = new Schema({
    title: String,
    date: Date
});
mongoose.model('App', AppSchema);

function eq(x, k) {
    return function(_, y) {
        k(x == y);
    }
}

function neq(x, k) {
    return function(_, y) {
        k(x != y);
    }
}

function snd(k) {
    return function(_, x) { return k(x); }
}

const App = mongoose.model('App');
exports.App = {
    create : function(title, k) {
        App.count({ title : title },
                  eq(0,
                     function(b) {
                         if(b){
                             const app = new App();
                             app.title = title;
                             app.date  = new Date();
                             app.save(k);
                         } else {
                             k("dup error")
                         }
                     }));
    },
    all : function(k) {
        App.find({}).asc('title').exec(snd(k));
    }
}