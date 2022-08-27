import Database from './database';
import sharp from 'sharp';
import dotenv from 'dotenv';
import sizes from './sizes.js';
import path from 'path';
// import yargs from 'yargs';

const db = new Database();

// console.log(db.getAllFiles());