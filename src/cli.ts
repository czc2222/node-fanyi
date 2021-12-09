#!/usr/bin/env node
import translate from './main';

const { program } = require('commander');
program.version('0.0.1')
  .name('fy')
  .usage('<english>')
  .argument('<English>')
  .action((english:string) => {
    translate(english)

  })
program.parse(process.argv)