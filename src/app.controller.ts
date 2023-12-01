/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2'
import { allatDto } from './allat.dto';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'állatkert'
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok] = await conn.execute('SELECT id, nev, kor, fajta FROM állatok');
    console.log(adatok);
    return {allatok: adatok,};
  }

  @Get('/allatok/:id')
  @Render('allat')
  async egyAllat(@Param('id') id:number){
    const [adatok] = await conn.execute('SELECT id, nev, kor, fajta FROM állatok WHERE id = ?', [id]);
    return adatok[0];
  }

  @Get("/ujAllat")
  @Render("ujallat")
  ujAllatForm(){

  }

  @Post("/ujAllat")
  async ujAllat(@Body() ujallat: allatDto){
    const nev = ujallat.nev;
    const kor = ujallat.kor;
    const fajta = ujallat.fajta;
    if(nev == '' || fajta == ''){
      return {messages: "kötelező kitölteni."};
    }
    const [adatok] = await conn.execute("INSERT INTO állatok (nev, kor, fajta) VALUES (?, ?, ?)", 
    [nev, kor, fajta]);
    return {};
  }
}
