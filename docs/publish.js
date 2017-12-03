'use strict'

const fs = require('fs');
const path = require('path');

const R = require('ramda');

//const {defaultTo, map, pipe, prop, tap, concat} = R;
const defaultTo = R.defaultTo;
const map       = R.map;
const pipe      = R.pipe;
const prop      = R.prop;
const tap       = R.tap;
const concat    = R.concat;

const handlebars = require('handlebars');
const hljs = require('highlight.js');
const helper = require('jsdoc/util/templateHelper');
const marked = require('marked');

const version = require('./package.json').devDependencies.ramda


const prettifyCode = R.pipe(
  R.join('\n'),
  R.replace(/^[ ]{5}/gm, ''),
  s => hljs.highlight('javascript', s).value
)

const prettifySig = R.pipe(
  R.replace(/[.][.][.]/g, '\u2026'),
  R.replace(/->/g, '\u2192')
)

//  Handles any combination of comma-separated and multi-line @see annotations.
const simplifySee = R.pipe(R.chain(R.split(/\s*,\s*/)), R.map(R.replace(/^R[.]/, '')))

const log = x => console.log(x); 

const titleFilter = pipe(R.propEq('title'), R.filter)

const valueProp = R.chain(prop('value'))

const removeAnonymous = function(str) { 
	//console.log(str)
	let strs = str.split('~');
	if (strs.length === 0) {
		return strs[0];
	}
	return strs[1];
	//'<anonymous>'
}

const simplifyData = R.applySpec({
    aka: pipe(
      prop('tags'),
	  defaultTo([]),
      titleFilter('aka'),
      valueProp,
      R.chain(R.split(/,\s*/))
    ),
	/*
    category: pipe(
      prop('tags'),
      titleFilter('category'),
      valueProp,
      R.head,
      defaultTo('')
    ),
	*/
	category: pipe(
      prop('memberof'),
      defaultTo(''),
	  removeAnonymous
    ),
    deprecated: pipe(
		prop('deprecated'), 
		defaultTo('')
	),
    description: pipe(
      prop('description'),
      R.defaultTo(''),
      marked
    ),
    example: pipe(
      prop('examples'),
      R.defaultTo([]),
      prettifyCode
    ),
    name: function(x) {
		return ''.concat(
			pipe(
				prop('memberof'),
				defaultTo(''),
				removeAnonymous
			)(x),
			'.',
			pipe(
				prop('name'),
				defaultTo('')
			)(x)
		);
	},
    params: pipe(
      prop('params'),
      defaultTo([]),
      map(R.applySpec({
        description: pipe(
          prop('description'),
          defaultTo(''),
          marked
        ),
        name: pipe(prop('name'), defaultTo('')),
        type: pipe(R.path(['type', 'names', 0]), defaultTo(''))
      }))
    ),
    returns: {
      description: pipe(R.path(['returns', 0, 'description']), defaultTo('')),
      type: pipe(R.path(['returns', 0, 'type', 'names', 0]), defaultTo(''))
    },
    see: pipe(
      prop('see'),
      defaultTo(''),
      simplifySee
    ),
    sigs: pipe(
      prop('tags'),
	  defaultTo([]),
      titleFilter('sig'),
      valueProp,
      map(prettifySig)
    ),
    since: pipe(
		prop('since'), 
		defaultTo('')
	),
    typedefns: pipe(
      prop('tags'),
	  defaultTo([]),
      titleFilter('typedefn'),
      valueProp,
      map(prettifySig)
    )
})

exports.publish = (data, opts) => {
	
  const templateFile = path.resolve(opts.destination, 'index.html.handlebars')

  const templateContent = fs.readFileSync(templateFile, {encoding: 'utf8'})

  const docs1 = helper.prune(data)()
    .order('name, version, since')
    .filter({kind: ['function', 'constant', 'class']})
    .get()
    .filter(x => x.access !== 'private');
	
	//console.log(docs1);
	const docs = docs1.map(simplifyData)

  const context = {
    docs: docs,
    version: version
  }

  const outputContent = handlebars.compile(templateContent)(context)

  const outputFile = path.resolve(opts.destination, 'index.html')

  fs.writeFileSync(outputFile, outputContent, {encoding: 'utf8'});
}
