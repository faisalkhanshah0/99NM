var fs = require('fs');
var hbs = require('hbs');

hbs.registerHelper({
  eq: function (v1, v2) {
      console.log(v1, v2);
      return v1 === v2;
  },
  ne: function (v1, v2) {
      return v1 !== v2;
  },
  lt: function (v1, v2) {
      return v1 < v2;
  },
  gt: function (v1, v2) {
      return v1 > v2;
  },
  lte: function (v1, v2) {
      return v1 <= v2;
  },
  gte: function (v1, v2) {
      return v1 >= v2;
  },
  and: function () {
      return Array.prototype.slice.call(arguments).every(Boolean);
  },
  or: function () {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  }
});
hbs.registerHelper('forpagination', function(pagecode, pageno, url, from, to, incr, block) {
    var accum = '';
    pageno = parseInt(pageno);
    if(pageno == 1){
        accum += `<li class="page-item disabled">
                    <a class="page-link" tabindex="-1">Previous</a>
                </li>`;
    }
    else{
        let prev = pageno-1;
        accum += `<li class="page-item">
                    <a class="page-link" href="${url}${prev}" tabindex="-1">Previous</a>
                </li>`;
    }
    for(var i = from; i <= to; i += incr)
        {
            if(i == pageno){
               accum += `<li class="page-item active">
                <a class="page-link" href="${url}${block.fn(i).trim()}">${block.fn(i).trim()}<span class="sr-only">(current)</span></a></li>`;
            }
            else{
                accum += `<li class="page-item"><a class="page-link" href="${url}${block.fn(i).trim()}">${block.fn(i).trim()}</a></li>`;
            }
            
            
        }
    if(pagecode == 0){
        accum += `<li class="page-item disabled">
                    <a class="page-link">Next</a>
                </li>`;
    }
    else{
        let next = pageno+1;
        accum += `<li class="page-item">
                    <a class="page-link" href="${url}${next}">Next</a>
                </li>`;
    }    
    return new hbs.SafeString(accum);
  });

var partialsDir = __dirname + '/views/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

